---
sidebar_position: 4
---

# Checking estimates using simulation

In the [linear regression tutorial](./linear_regression_1.md) we saw results like this:

                   Estimate Std. Error   t value     Pr(>|t|)
    (Intercept)  0.04473606 0.01650016  2.711250 0.0130793191
    dosage       0.03918108 0.01086677  3.605588 0.0016614274
    stagefetal  -0.04770967 0.01241647 -3.842451 0.0009462768


When we included 'stage' as a covariate, the estimate of the genotype effect was around 0.04 with an estimated standard error of
0.011 - leading to a P-value of 0.0017.

Formally speaking, the standard error and P-value are all about the *sampling distribution* of the estimate. The standard errors
says: if we were to repeat the experiment many many times, how would the estimate vary around the true parameter value? And the
P-value says: how often would we see such a big estimate if the true effect was zero?

However the linear regression model above has a peculiarity: it **treats the genotype as if it were known beforehand**. In this
study, it wasn't known beforehand.  So is our P-value accurate?

On this page we'll use simulation to check this.

## Getting started

To do this, we'll write a function that:

* simulates some genotypes given a known frequency
* simulates a new outcome variable given the genotypes and afixed effect size
* and then runs the linear regression again.

We will then ask: what proportion of simulations have an effect size at least as big as the observed one?

This simulation approach therefore provides a direct calculation of the P-value.

### Simulating a data frame

Let's first build our data frame with the stage variable in:

```
simulated_data = tibble(
    stage = c(
        rep( 'adult', 12 ),
        rep( 'fetal', 12 )
    )
)
```

To simulate genotypes, let's assume some frequency $f$ of the 'G' allele. For example, in our data the rs1419114 'G' allele has
about 80% frequency, so let's use that for now:

```
f = 0.8
simulated_data$dosage = rbinom(
    n = 24,                            # 24 samples
    size = 2,                          # draw two alleles per sample...
    prob = f                           # ...each with frequency f
)
```

:::tip Not
Use `table()` to look at the results - does it look about right?
:::

To simulate an outcome variable, let's assume some effect sizes now.  We will start with the estimated effects above:
```
params = c(
    mu = 0.04473606,
    beta = 0.03918108,
    gamma = -0.04770967
)
```

To make things comparable let's ensure that all outcome variables have the same variance. In our current data the
trait variance is:
```
var( data$reads_per_base_per_million )
```

   [1] 0.001311839

To ensure this variance we will use the *variance addition formula*, relying on the fact that our variables are simulated
independently:

$$
\text{var}(\text{trait}) = \text{var}(\gamma\cdot\text{stage}) + \text{var}(\beta\cdot\text{genotype}) + \text{residual variance}
$$

or

$$
\text{var}(\text{trait}) = \gamma^2 \text{var}(\text{stage}) + \beta^2 \text{var}(\text{genotype}) + \text{residual variance}
$$

...so the residual variance is:

$$
\text{residual variance} = 0.001311839 - \gamma^2 \text{var}(\text{stage}) + 2 \beta^2 f (1-f)
$$

:::tip Note

This last formula uses the fact that the variance of our genotype is $2f(1-f)$. This is the well-known [variance of a binomial
variable](https://en.wikipedia.org/wiki/Binomial_distribution).

:::

Now to simulate data is easy:

```
simulated_data$outcome = (
    params$mu
    + params$gamma * ( simulated_data$stage == 'fetal')
    + params$beta * simulated_data$dosage
)

residual_variance = (
    trait_variance
    - (gamma^2 * var( simulated_data$stage == 'fetal' ))
    - (beta^2 * 2 * f * (1-f))
)
simulated_data$outcome = simulated_data$outcome + rnorm( n = 24, mean = 0, sd = residual_se )
```

:::note Note

It's not obvious that this choice of matching variances is the 'right' thing to do. For example, maybe we should match residual
variance instead? This illustrates a difficulty with simulating: you have to make choices about things like variance that you
don't necessarily know beforehand - this is also a benefit as it forces you to think it through.

:::

Finally let's wrap that into a function to make it easy to run:
```
simulate_data = function(
    N = 24,                         # number of samples
    f,                              # frequency of 'G' allele
    beta,                           # genotype effect size
    trait_variance = 0.0013,        # total trait variance to match
    mu = 0.04473606,
    gamma = -0.04770967
) {
    simulated_data = tibble(
        stage = c(
            rep( 'adult', 12 ),
            rep( 'fetal', 12 )
        ),
        dosage = rbinom(
            n = 24,                            # 24 samples
            size = 2,                          # draw two alleles per sample...
            prob = f                           # ...each with frequency f
        )
    )
    simulated_data$outcome = (
        mu
        + gamma * ( simulated_data$stage == 'fetal')
        + beta * simulated_data$dosage
    )
    residual_variance = (
        trait_variance
        - (gamma^2 * var( simulated_data$stage == 'fetal' ))
        - (beta^2 * 2 * f * (1-f))
    )
    simulated_data$outcome = simulated_data$outcome + rnorm( n = 24, mean = 0, sd = sqrt(residual_variance) )
    return( simulated_data )
}
```

:::tip Question

Run your function a few times and plot the data like we did before - with the dosage on the x axis and a violin and/or dot plot on the y axis.
Does this look roughly like the original data?

:::

### Estimating in the simulations

Now let's get back to testing whether the regression output was sensible. To do this, let's assume for a moment that the null
model is true ($\beta=0$) and let's simulate lots of datasets using the function above. We'll then use this to get an empirical
P-value and standard errors based on this simulation.  Here is a function to do that:

```

simulate <- function(n_simulations = 100, N = 24, f = 0.8 ) {
    result = tibble()
    for( i in 1:n_simulations ) {
        dataset = simulate_data( N = 24, f = f, beta = 0 )
        l = lm( outcome ~ dosage, data = dataset )
        coeffs = summary(l)$coefficients

        if( nrow( coeffs ) > 1 ) {
            result = rbind(
                result,
                tibble(
                    simulation = i,
                    beta = coeffs['dosage',1],
                    se = coeffs['dosage',2],
                    p = coeffs['dosage',4]
                )
            )
        } else {
            # it is possible that the simulated genotype has no variability
            # in this case the model is not fit.
            result = rbind(
                result,
                tibble(
                    simulation = i,
                    beta = 0,
                    se = Inf,
                    p = 1
                )
            )
        }
    }
    return( result )
}

simulate( 100 )
```

You should see a data frame with the regression results for all our simulated data. 

The original P-value was $0.0017$ so we will need a large number of simulations to really capture this.  Let's try 10,000:
```
simulations = simulate(10000)

```

:::tip Note

This will likely take a few minutes to run!  If you get bored, quit it and try 10,000 instead.
:::

Now it's possible to use the simulations to compute a standard error and p-value:
```
empirical.se = sd( simulations$beta )
empirical.p = length( which( abs( simulations$beta ) > 0.03918108 )) / nrow( simulations )
```

:::tip Question

Compare these values with those from the `lm` fit above.  How do they compare?

:::

