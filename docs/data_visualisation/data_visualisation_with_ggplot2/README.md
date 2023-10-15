---
sidebar_position: 2
author: "Samvida S. Venkatesh"
date: '2021-10-21'
---

# More data visualisation in R

**Authors**: Samvida Venkatesh.

Welcome!  In this tutorial we will further explore ways to visualise data using the R packages
[`dplyr`](https://dplyr.tidyverse.org) and [`ggplot2`](https://ggplot2.tidyverse.org). 

## Getting set up

`dplyr` and `ggplot2` are part of [tidyverse](https://www.tidyverse.org). If you followed the
[tidyverse installation section](/prerequisites/tidyverse.md) you'll have this already - if not let's install
it now:

```R
install.packages("tidyverse") 
```

We'll use real data on population size, life expectancy and GDP from
[gapminder.org](https://www.gapminder.org), and ecological data from
[palmerpenguins](https://allisonhorst.github.io/palmerpenguins/), so let's install those packages
too:

```R
install.packages("gapminder")
install.packages("palmerpenguins")
```

Lastly to make good-looking plots we need cool colour palettes - [Color
Brewer](https://colorbrewer2.org) is one of these so let's install:

```R
install.packages("RColorBrewer")
```

Load these into a running R session:

```
library(ggplot2)
library(dplyr)
library(RColorBrewer)
```

As a last step we are going to default to a 'bw' style of plots, so let's set out `ggplot2` theme now:

```
ggplot2::theme_set(theme_bw())
```

