# Asymptotics and  P-values

Much of classical statistics relies on 'asymptotics', which means statistical behaviour when data
volumes get large. In this setting likelihood functions tend to become very well-behaved - they
become governed by Gaussian distributions.

There are two closely related ways this plays out:

- If β₀ is the 'true' value of the parameter β, then the maximum likelihood estimate β̂ becomes asymptotically normally distributed around β₀.
- the likelihood function itself becomes approximately guassian (i.e. the log-liklihood becomes quadratic)

What's more, the variance in each case asymptotically the same - it is approximately equal to $I =
-H^{-1}$ where $H$ is the second derivative of the loglikelihood function.

For this to hold, some conditions must of course be true. Two crucial ones are: that not just the
data points but the 'amount of information' in the data $\rightarrow \infty$ (i.e. it's no use
having a million measurements of the same thing). Also, for it to work the true parameter value
must be in the interior of parameter space, the likelihood function has to be sufficiently smooth,
and so on.

For more on the asymptotics of the mle see [Efron & Hastie](https://web.stanford.edu/~hastie/CASI_files/PDF/casi.pdf) Chapter 4.

## Asymptotics in practice

Asymptotics are everywhere. For example, consider this logistic regression fit done in `R`:

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

* The `Estimate` column gives the maximum likelihood estimate $\hat{\beta}$ - that is, the value
  maximising the likelihood function. (This also maximises the log-likelihood, of course, because
  `log` is monotone increasing.)

* The `Std. Error` is computed from the curvature of the log-likelihood function at the mode as
  follows: let $H$ be the 2nd derivative at the mode, and compute $I=-H^{-1}$. Then the standard
  errors are square root of the diagonal entries.

* The `Pr(>|z|)` column gives 'Wald test' P-values and are computed as follows. Consider a Gaussian
  distribution centred at 0 with standard deviation equal to the given standard error. Then compute
  the mass under the two tails of this distribution.


You can confirm this P-value computation yourself by manually computing the P-value:

```R
coefficients = summary(fit)$coeff

pvalue = 2 * pnorm(
	-abs(coefficients['predictor', 'Estimate']),
	mean = 0,
	sd = coefficients['predictor', 'Std. Error']
)
print(pvalue)
```

An **odd thing** about this is that even though we are computing a P-value, which is all about the
'null' model where $\beta \equiv 0$, to compute this p-value we have only fit the full model (where
$\beta$ can be nonzero).

The Wald test is fairly ubiqitousin statistical genetics - for example it's what
[plink](https://www.cog-genomics.org/plink/) computes when conducting association tests.

## The likelihood ratio test

The Wald test is not the only way to compute a p-value. Another very useful form is the *likelihood
ratio test*. This is obtained by comparing the maximum log-likelihood under the null model and
under the full model via the formula:

$$
\text{lr ratio test statistic} = -2 \times \left( \text{ll}_{\text{null}} - \text{ll}_{\text{alternative}} \right)
$$

(It's a *likelihood ratio test* because if you take the exponential of the above expression you get
something proportional to the ratio of likelihoods. 

:::note

The alternative model log-likelihood is always larger than under the null, of course, even if the
null model is true. This is because sampling variation means that the best fit to the data won't be
exactly at the true value $\beta_0$.

:::

If the asymptotic approximation above holds, then the likelihood ratio test statistic turns out to
be Chi-squared distributed, thus again easy to compute. 

In R, following the above example, we could computed it like this:

```R
    null.fit = glm( outcome ~ covariate1 + covariate2, family="binomial", data = X )
    lr.statistic = -2 * ( logLik(fit) - logLik(null.fit))
    pchisq( lr.statistic, df = 1 )
```

A quicker way is to use the `drop1` function:
```R
    drop1( fit, test = "LRT" )
```
which will successively drop 1 variable out of the formulae and compute the LRT for it.


