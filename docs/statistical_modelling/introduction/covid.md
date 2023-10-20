---
sidebar_position: 10
---

# What to make of a COVID test

Let's apply Bayes formula to this question:

:::tip Problem

Suppose you test +ve for COVID using a lateral flow test.  How certain should you be that you are infected?

:::

Like **many scientific** problems, this one can be solved (in the 'narrow' sense) by applying [Bayes'
formula](./bayes.md).  Let's try now:

$$

P\left(\text{infected}|{\text{+ve test result}}\right) = \frac{P\left(\text{+ve test result}|\text{infected}\right) \cdot \text{prior}(\text{infected})}{\text{denominator}}

$$

But how can we generate those numbers?

Luckily there are huge datasets in which to estimate the quantities!  See this [review of COVID-19 lateral flow test accuracy](https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD013705.pub2/full) Cochrane Database.

It reports results as:

- "Sensitivity" i.e. $P(\text{+ve test result}|\text{infected})$ as 72% for symptomatic and 58% for asymptomatic patients
- "Specificitiy" i.e. $P(\text{-ve test result}|\text{not infected})$ as 99.6%.

Meanwhile, population COVID rates are still being reported (albeit, given the lack of systematic testing, these must be somewhat underestimated now).

For example for Oxfordshire, UK the [numbers in September 2023](https://www.oxfordshire.gov.uk/council/coronavirus-covid-19/latest-figures) were around a maximum of:

* 21.8 cases per 100,000 people in under-59s
* or 57.5 cases per 100,000 in the over-60s

(To be conservative, I suggest we err on the side of caution and imagine the true rate to be substantially larger than this - say 100 in 100,000.)

**Can you use Bayes' theorem to answer the question? **


:::tip Note

Remember we can compute the denominator by **summing over the possibilities in the numerator**.
Here the possibilities are 'is infected' or 'isn't infected'.  So the denominator is:
$$

\text{denominator}
= P\left( \text{+ve}|\text{infected}\right) \cdot P\left(\text{infected} \right)
+ P\left( \text{+ve}|\text{not infected}\right)\cdot P\left(\text{not infected} \right)

$$