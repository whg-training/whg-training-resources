# Asymptotics and  P-values

Much of classical statistics relies on 'asymptotics', which means the statistical behaviour when
data volumes get large. In this setting likelihood functions tend to become well-behaved. There are
two closely related ways this plays out (at least for well-behaved likelihoods):

- If β₀ is the 'true' value of the parameter β, then the maximum likelihood estimate β̂ becomes asymptotically normally distributed around β₀.
- the likelihood function itself becomes approximately guassian (i.e. the log-liklihood becomes quadratic)

What's more, the variance in each case asymptotically the same - it is approximately equal to $I =
-H^{-1}$ where $H$ is the second derivative of the loglikelihood function.

For more on the asymptotics of the mle see [Efron & Hastie](https://web.stanford.edu/~hastie/CASI_files/PDF/casi.pdf) Chapter 4.

## How this is used in practice.

For example, consider this logistic regression fit done in `R`:

```R
X = # (some data)
fit = glm(
	outcome ~ predictor + covariate1 + covariate2,
	family="binomial",
	data = X
)

print( summary(fit)$coeff )
```
		
		
                   Estimate Std. Error    z value     Pr(>|z|)
    (Intercept)  0.02420081 0.02221072  1.0896003 2.758893e-01
    predictor    0.19235083 0.03311230  5.8090450 6.283019e-09
    covariate1  -0.01183213 0.01636611 -0.7229654 4.697012e-01
    covariate2   0.12801224 0.01666143  7.6831465 1.552279e-14

In this output:

* The `Estimate` column gives the maximum likelihood estimate $\hat{\beta}$ (i.e. the mode of the
  loglikelihood).

* The `Std. Error` is computed from the curvature of the log-likelihood function at the mode as
  follows: let $H$ be the 2nd derivative at the mode, and compute $I=-H^{-1}$. Then the standard
  errors are square root of the diagonal entries.

* The `Pr(>|z|)` column gives 'Wald test' P-values and are computed as follows. Consider a Gaussian
  distribution centred at 0 with standard deviation equal to the given standard error. Then compute
  the mass under the two tails of this distribution.

If you wanted to you could confirm this by 1. manually computing the 2nd derivative H (e.g. use the `logistic.regression.ddll()` function from the `solutions part 2.R` file) 2. inverting it with `solve(H)`. 3. take square roots of diagonal entries for standard errors.  4. use `
```R
    pvalue = 2 * pnorm( abs( β̂ ), sd = se, lower.tail = F )
```
To compute the P-value.

Note that even though we are talking about a distribution under the null model, computation of this
'Wald test' p-value only involves computing the full model.

## What does this mean?

The P-value is a statement of how unlikely an observed effect of the magnitude of β̂ would be, if
the null model β = 0 were true. Of course, that model is never literally true, but in some
situations it does make sense to think of effects that way.

One such case might be Genome-wide association studies of some traits, in which most of the genome
is not associated with the trait but a few genetic variants across the genome have substantial
effects. (Severe malaria seems to be one example of a trait like this and there are arguments that
this picture is pervasive.) However, what we'd really like to do, if we could, is to model the full
spectrum of effect sizes.

## Other ways to compute a p-value

Another commonly reported P-value is the likelihood ratio test P-value, which is obtained by
computing the log-likelihood under the null model and then again under the alternative model. The
alternative always has larger log-likelihood, even if the null model is true. This is because
sampling variation means that the best fit to the data won't be exactly at β₀. But, if the
asymptotic approximation above holds, then the distribution of the likelihood ratio can be computed - it boils down to a ratio of Gaussian quantities which is Chi-squared distributed.  

In R it could be computed like this:
```R
    null.fit = glm( outcome ~ covariate1 + covariate2, family="binomial", data =X )
    lr.statistic = -2 * ( logLik(fit) - logLik(null.fit))
    pchisq( lr.statistic, df = 1 )
```
(Or you could use your `logistic.regression.ll()` function instead of `logLik()`.

A simpler way is to use the `drop1` function:
```R
    drop1( fit, test = "LRT" )
```
which will successively drop 1 variable out of the formulae and compute the LRT for it.

