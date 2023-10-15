---
sidebar_position: 11
---

# Saving your figures
To make sure you don't lose all your hard work - let's save the plot to a pdf. (You can also save to tiff, png, etc.,
but pdfs have the nice property that they don't lose anything due to image resolution - I suggest using them unless your
plot has a huge number of points.)

You can do this in RStudio by clicking on the `Export` button just above the plot pane.  Alternatively in R itself:


```R
ggsave(
  plot = p2_3c,
  filename = "gdp_vs_lifeexp_2007.pdf",
  width = 6,
  height = 4
)
```

:::tip Note

For pdf files, widths and heights are specified in inches by default. 

For image file formats like PNG, widths and heights are in pixels by default instead (so you will need much bigger values - 640x480 is probably the minimum useful for most purposes.)

(You can change the default unit using the `units` argument - see an example below.)

:::
