---
sidebar_position: 3
---

# The most important formula in science

The most important formula is... Bayes theorem!

Let's write it now. Suppose $Z$ is *something we care about* - say, a scientific theory, or the chance of having disease.
We collect some data to tell us about it. Bayes' theorem now tells us:

$$

P\left(Z|\text{data}\right) = \frac{P\left(\text{data}|Z\right) \cdot P(Z)}{P(\text{data})}

$$

This formula lets us make inferences about the thing we care about (on the left) in terms of a *model of the data* (the
first term on the right).  

To make sense of this formula you need to understand the different pieces.  They have specific names.

* **The posterior**. The left-hand side is what we should believe about the *thing we care about* $Z$, once we have seen
  the data, and is known as the posterior distribution.

* **The prior**. The second term on the right is an what we believed about the *thing we care about* $Z$, **before** we saw
  any data.  It is known as the prior distribution.

* **The likelihood**. The first term on the right is an assumed **model for the data**.
  It is known as the **likelihood**.

* **The normalising constant**.  The denominator is discussed further below.

In other words, Bayes' theorem tells us how to update our beliefs about something given some data.

## Using Bayes in practice

In practice it's easy to use Bayes.  We do this:

1. generate some data
2. define a model of the data (a likelihood function)
3. Figure out what prior information we have
4. And then apply the formula

:::caution Warning

Bayes theorem is a computational tool that depends on the modelled assumptions.  As long as we believe our data model
and prior information, it lets us quantify what our conclusions should be. It does not by itself answer more general
questions like "how do I know if this model is sensible?" or "was there a data artifact?" or "What other possibilities
were there?" - it's purely a computational tool given the model at hand.

:::

## The denominator

You might be thinking - what's that denominator, why is it a 'normalising constant' - and how would you compute it?

Here are a few things to note.

1. **The denominator does not depend on $Z$**.  (Look, there's no $Z$ in the brackets). 

In this sense it is a 'constant'.

2. **The denominator makes the left-hand side sum to one** - because, after all, the left hand side is a distribution,
   so it must sum to one.  This has two useful consequences.  First, in many cases we don't have to worry about the
   denominator at all - the maths already tells us what it is.  (We'll do some examples like this shortly).  Second,
   even if that doesn't work out, we can compute the denominator by summing the numerator - over all the possible outcomes
   instead of just the one we cared about, $Z$.  In this form the equation becomes

$$

\text{denominator} = P(\text{data}) = \sum_Y P\left(\text{data}|Y\right) \cdot P(Y)

$$


Second, 

The second thing to note is that **in many cases we don't need to worry about the denominator at all**.  Because:

* The left-hand side is a distribution - it **sums to one**.
* So the normalising constant is just a number needed to **make the thing sum to one**.

We'll do some examples like this in a moment, in which everything works out analytically, and the mathematics tells us
what the normalising constant must be.

On the other hand there are situations where this doesn't work - these are indeed harder.  In these situations,
computing the normalising constant is what methods like MCMC are for (but we won't do that for now.)


