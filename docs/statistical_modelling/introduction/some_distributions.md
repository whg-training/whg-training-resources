---
sidebar_position: 1
---

# Probability distributions

Let's look at some commonly-used distributions.  Here are a few useful ones.


| Distribution name  |  R function | parameters | domain                 |  Expression | Explanation |
| -----------------  | ----------- | ----------- | ------------- | -----------  | ---------- |
| Binomial           | `dbinom()`  | 'number of trials' $n$, and probability $p$ | Integers $0, \cdots, n$ | $${n \choose x} p^x (1-p)^{(n-x)}$$ | Number of successes in $n$ trials |
| Normal or Gaussian | `dnorm()`  | mean $\mu$ and variance $v$ | Real numbers | $$\frac{1}{\sqrt{2\pi\cdot v}}\cdot e^{-\frac{1}{2}\frac{(x-\mu)^2}{v}}$$ | Ubiquitously useful |
| Uniform            | e.g. `dunif()` | (none) | Any domain, e.g. $[0,1]$ | (constant probability) | Everything has the same probability! |
| Beta            | `dbeta()`   | $\alpha$ and $\beta$  | $[0,1]$| $$\frac{1}{B(\alpha,\beta)}\cdot x^{\alpha-1} \cdot (1-x)^{\beta-1}$$ | E.g. allele frequency estimates |

This is a good time to get a sense of what these look like.

## Binomial distribution

:::tip Challenge

Pick a **number of trials** *n* (start between 5 and 20) and a probability $p$ (start between 0.1 and 0.9).  Then plot the *binomial distribution* over the range of integers $x = 0, 1, 2, \cdots, n$.

The binomial distribution is given by `dbinom()` in R, and can be used like this:
```r
dbinom( x, size = n, prob = p )
```

How does the shape of the binomial differ as you vary $n$ and $p$?

**Note.** The expression for the binomial distribution is:

$$
x|n,p \sim {n \choose x} p^x (1-p)^{n-x}
$$

Here ${n \choose x}$ means 'n choose x' - the number of ways of choosing x things from n things - which can be computed using `choose(n,x)` in R.
For **extra kudos**, plot this using your own function `binomial(x, n, p)` implementing the above formula.

:::

## Normal distribution

:::tip Challenge

Pick a *mean value* $\mu$ (start somewhere between $-10$ and $10$) and a *variance* $v$ (which must be positive - for example, $2$ is a good starting choice). Then plot the density of the **normal distribution** over the continuous range $x=-20 \cdots 20$.

**Note**. the normal distribution density is given by `dnorm()` in R, but you have to specify the standard deviation (i.e. the **square root of the variance**) instead of the variant
```r
dnorm( x, mean = mu, sd = sqrt(v) )
```

How does the distribution differ as you vary $\mu$ and $v$?

For **extra kudos**, ignore `dnorm()` and write your own function `normal()` to compute this based on the normal distributino density formula:

$$
x|\mu,v \sim \frac{1}{\sqrt{2*\pi*v}}\cdot e^{\frac{1}{2}\frac{(x-\mu)^2}{v}}
$$
:::

## Beta distribution

:::tip Challenge

Pick 'shape' parameters $\alpha$ and $\beta$ (make them between 1 and 10 to start) plot the *beta distribution*:

$$
x | \alpha,\beta \sim \frac{1}{B(\alpha,\beta)} x^{\alpha-1} (1-x)^{\beta-1}
$$

over the (continuous) range $x=0 \cdots 1$.

**Note.** The beta distribution is implemented as `dbeta()` in R, but you have toi use "shape1" and "shape2" instead of $\alpha$ and $\beta$:
```r
dbeta( x, shape1 = alpha, shape2 = beta )
```
How does the shape vary as you change the parameters?  What happens if they are less than 1?

For **extra kudos**, ignore `dbeta()` and write your own function `beta_distribution()` to compute this based on the normal distributino density formula:

$$
x | \alpha, \beta \sim \frac{1}{B(\alpha,\beta)} x^{(\alpha-1)} \cdot (1-x)^{(\beta-1)}
$$

You can use the `beta()` function to compute that $B(\alpha,\beta)$ on the 
:::

