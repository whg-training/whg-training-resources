---
sidebar_position: 6
---

# Making a regional association plot

In this part of the practical, we will hone our R plotting skills to make beautiful regional association plots (‘hitplots’) of
the most associated regions in our scan.

:::tip Note

This section of the practical is optional - it is about making publication-ready plots of the results. You should only carry
it out if you’ve successfully completed the other parts and have time to go on.

:::

## Plotting associated regions

### Anatomy of a hitplot

A good regional association plot - or 'hitplot' for short - shows several things:

- The evidence for association across the region
- Information about the recombination landscape and linkage disequilibrium
- Regional genes and other potentially interesting annotations.
- Information on the variants being tested – such as whether they are directly typed or imputed (in this practical, we assume all variants are directly typed) or whether they have predicted function.

To make a hitplot we need to load data on all of these things. To begin, make sure you have loaded the association scan from
the last part of the practical:

```R
# In R:
data <- read.table( "pccorrected-test.assoc.logistic", header = TRUE )
data <- data[data$TEST == "ADD",]
```

### Computing linkage disequilibrium values

We’ll start by getting plink to compute LD between the most-associated SNP in each of the strongest three association peaks
and the other SNPs in the dataset. First let’s identify what the top SNPs in each region are (we'll take those with the lowest
P-value here):

```R
# In R:
data <- data[order( data$P ), ]
data[ which( data$BP > 2.5E7 & data$BP < 3.5E7 )[1],]
data[ which( data$BP < 1.5E7 )[1],]
data[ which( data$BP > 4.5E7 )[1],]
```

Note down the rsids (in the ‘SNP’ column) of the three SNPs. As a sanity check, all three should have a P-value less than
$1\times 10^{-6}$. In this practical we’ll concentrate on the third SNP, which has the lowest P-value, but a question will ask
you to repeat this for the other two SNPs. Now in the terminal let’s use plink to compute LD:

```sh
./plink \
--bfile chr19-clean \
--keep resources/controls.txt \
--r2 dprime \
--ld-window 10000 \
--ld-window-kb 1000000 \
--ld-window-r2 0.05 \
--ld-snps rs57558361 rs376047 rs112820994 \
--threads 1
```

(We've added `--threads 1` to this command to make sure plink doesn't use lots of threads.)

This command says to compute pairwise $r^{2}$ and $D’$ statistics (which are measures of LD) between the three lead SNPs and
all other SNPs within a window around them. Only SNPs with $r^2 > 0.05$ will appear in the output file. (We’ve restricted the
computation to control samples. If these are population controls then we are therefore estimating LD in the population). Let’s
load the result into our R session:

```R
# In R:
ld <- read.table( "plink.ld", hea=T, as.is=T )
head(ld)
```

Have a look at the results. The last two columns contain estimates of $r^2$ and $D'$ between the SNPs listed in SNP_A and
SNP_B columns. For plotting, it's simplest to bin those values:

```R
# In R:
ld$R2_bin <- cut( ld$R2, breaks = seq( 0, 1, by = 0.1 ))
head(ld)
```

### Loading gene annotations

Now let's load the other data we need. First, we'll load information on genes from the file `resources/refGene_chr19.txt`
(which originates from the UCSC Genome browser):

```R
genes <- read.table( "resources/refGene_chr19.txt.gz", header = TRUE, as.is = TRUE )
head( genes )
```

This file is a bit like the `.gff` format gene annotation files you may have seen elsewhere, but in a slightly different
format. It contains gene names (in the `name2` column), transcription start and end points (`txStart`, `txEnd`), and the
positions of exons (`exonStarts`, `exonEnds`).

Note that many genes in the file (such as *FUT2*) have several transcripts. That's useful information but is a bit too much detail for
our plot, so for our purposes let's just keep the longest transcript of each gene:

```R
select_longest_gene = function( genes ) {
    result = genes[ order( genes$txEnd - genes$txStart, genes$exonCount, decreasing = TRUE ), ]
    result = result[ which( !duplicated( result$name2 )), ]
    return( result )
}
genes = select_longest_gene( genes )
```

We'll also load some helper code that will help us plot these genes:

```R
source( 'scripts/plot.genes.R' )
```

### Loading the recombination rate

Next we'll load recombination rate estimates from the HapMap project:

```R
genetic_map <- read.table( "resources/genetic_map_chr19_combined_b37.txt.gz", hea=T, as.is=T )
head( genetic_map )
```

The recombination rate is expressed in *centimorgans per megabase* and provides values along the genome.

### Finding a focal region

We're nearly ready to plot! We'll make a hit plot near the most-associated SNP (rs112820994). Let's choose a sensible region
around it:

```R
focus.snp = 'rs112820994'
focus.pos = data$BP[ data$SNP == focus.snp ]
region = c( focus.pos - 250000, focus.pos + 250000 )
```

### Making an initial hitplot

We'll make a plot divided into sections, something like this:

    panel 1: Main hitplot
    panel 2: Genes
    panel 3: Recombination rate  

To do this, we're going to use 'base R' graphics which gives us great flexibility (although it can be a bit cryptic). The
`layout()` command can be used to split the plotting area into sections with different heights.

```R
layout.matrix = matrix( c(1,2,3), ncol = 1 )
layout(
    layout.matrix,
    heights = c(1,0.5,0.5)
)
```

First let's plot the association statistics. Since we're plotting other stuff underneath, we'll suppress the X axis label. We
also use par(mar = …) to reduce the space around the plot:

```R
par( mar = c(1,4,2,2))
plot(
    data$BP,
    -log10( data$P ),
    xlim = region,
    xlab = '',
    ylab = "-log10( P-value )"
)
```

Now let's use the `plot.genes` function loaded above to plot genes in the second panel, and plot the recombination rate

```R
plot.genes( genes, region )
plot(
    genetic_map$position,
    genetic_map$ COMBINED_rate.cM.Mb.,
    type = 'l',
    xlim = region,
    ylab = "cM/Mb"
)
```

Beautiful!  But not beautiful enough.  Let's refine it.

### Refining the hitplot

Now we'll make several modifications to make the plot really publication-ready. First we'll colour points using the binned $r^2$
values we loaded earlier. (To do this, we'll use the `heat.colors()` function to generate a nice palette for this):

```R
palette = heat.colors(10)
region.ld = ld[ ld$SNP_A == focus.snp & ld$BP_B >= region[1] & ld$BP_B <= region[2] & !is.na( ld$R2_bin ), ]
data$colour = "black"
data$colour[ match( region.ld$SNP_B, data$SNP ) ] = palette[ as.integer( region.ld$R2_bin ) ]
```

We can plot it again using these colours like this:

```R
par( mar = c( 1, 4, 2, 2 ))
plot(
    data$BP, -log10( data$P ),
    col = data$colour,
    pch = 20,
    xlim = region,
    xlab = '',
    ylab = "-log10( P-value )"
)
```

(In the above we used `pch=20` to get filled circles instead of open ones.)

It's also helpful to provide a legend. The `legend()` command can be used to add one to the plot. A legend with helpful labels
is:

```R
legend(
    "topright",
    col=c("black",heat.colors(10)),
    pch = 20,
    legend = c(
        "r²<0.1",
        sprintf( "r²≥%.1f",seq(0.1,0.9,by=0.1 ))
    )
)
```

We can also add a grid to let viewers locate points better:
```R
grid()
```

The plot is... getting there.

###

To production-ise this, we have wrapped up the above code - with a few more cosmetic tweaks - into a function `hitplot()`,
stored in the file `scripts/hitplot.R`. Load this into Rstudio and run it. You can use it to produce the finished plot like
this:

```R
source( 'scripts/hitplot.R' )
hitplot( 'rs112820994', data, genes, ld, margin = 200000 )
```

Or save to a pdf like this:
```
pdf( file = "rs112820994_hitplot.pdf", width = 8, height = 6 )
hitplot( 'rs112820994', data, genes, ld, margin = 200000 )
dev.off()
```

Now use your plot to answer these questions:

:::note Questions

* What gene is rs112820994 in? Is it in an exon? Are other top SNPs in the region also in genes? (You may need to play around
  with the `margin` argument to zoom in or out of the plot. You can cross-check results using genome browsers such as the
  [UCSC Genome Browser](https://genome.ucsc.edu/cgi-bin/hgGateway) - note that we are using GRCh37/hg19 coordinates).

* Does the extent of association look sensible with respect to LD? Are there any obvious features near the boundaries of the
  region of associated SNPs that could explain why the association signal dies off there?

* Make a similar plot for each of the other regions we computed LD for above. Do they look similar? Is there anything odd
  about them?

* Having looked at the variants in the genome browser – what other genomic features would you add to the hitplot if you had
  time? How would you add these?

:::

:::tip Challenge question

This one is a real coding challenge - only try this if you've got time. In the sample folder there's a file called
"resources/snp138_chr19.txt.gz" containing information from dbSNP on variants in each region.  You can load this in like this:
```
functional_data = read.table( "resources/snp138_chr19.txt.gz", sep = "\t", header = TRUE )
```
The column called `func` lists putative functional consequences of each variant.

The challenge is to create a version of the hit plot that overplots different shapes to show the functional annotation.

**Hints:**

1. The 'func' column in snp138 contains many categories and you'll first need to simplify it for plotting. One way is to take
the most 'severe' category for each SNP. A rough list of useful categories, in descending order of imporance, might be:
missense, nonsense, stop-gain, stop-loss, splice-3, splice-5, untranslated-3, untranslated-5, intron. E.g. the following code
shows how to make a simpler variable func2:

```R
snp138$func2 = NA
snp138$func2[grep('intron',snp138$func)] = 'intron'
snp138$func2[grep('untranslated-5',snp138$func)] = 'untranslated-5'
snp138$func2[grep('untranslated-3',snp138$func)] = 'untranslated-3'
# …etc.
```

(To cut down copy-pasting, you may want to turn the above into a loop - make sure to go through them in least-to-most important order.)

2. Use this to add a 'functional_annotation' column to the association test data frame, data. You should be able to match snp138 to data using
the name column. (This depends on the SNPs being named correctly though! Are there any SNPs that match by position but not
name?)

3. The `points()` command can be used to overplot points on an existing plot. Use the pch argument to specify shape. (Only plot
points that have functional_annotation != 'none').

4. pch takes an argument that is a positive integer in the range 1-20, say (google for 'R shapes' to see a table of shapes).
One way to turn categories into integers for pch is to first convert them to a factor, e.g.
```R
data$functional_annotation = factor(
    data$functional_annotation,
    levels = c(
        'missense', 'nonsense', 'stop-gain', 'stop-loss', 'splice-3', 'splice-5', 'untranslated-3', 'untranslated-5', 'intron'
    )
table( as.integer(data$functional_annotation) )
```

5. You also need a legend!

:::

### Next steps

Congratulations! You have now conducted a complete GWAS study and started on the next steps: trying to figure out what the
associated SNPs do.  This marks the end of this practical.

