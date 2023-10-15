
# Getting setup


## Loading libraries

We'll begin by loading a series of R libraries containing useful functions for data visualisation. If you have not yet installed these libraries, you can do so by running the following code:


```r
install.packages("tidyverse")
install.packages("matrixStats")
install.packages("reshape2")
install.packages("pheatmap")
install.packages("ggpubr")
install.packages("ggrepel")
install.packages("hexbin")
```

Let's now load the libraries.


```r
library(tidyverse)
library(matrixStats)
library(reshape2)
library(pheatmap)
library(ggpubr)
library(ggrepel)
library(hexbin)
```

## Loading data

We will now load the GTEx gene expression table, as well as a table containing annotations for each of the genes measured in the study.  The data can be found in [this folder](https://www.well.ox.ac.uk/~gav/projects/whg-training-resources/data/data_visualisation/visualising_rna-seq_data/) - download both files now.

:::tip Note
We recommend working in a new folder for this - for example by running this in your terminal:
```
mkdir rna-seq_practical
cd rna-seq_practical
curl -O https://www.well.ox.ac.uk/~gav/projects/whg-training-resources/data/data_visualisation/visualising_rna-seq_data/GTEx-v8-RNAseq_mean-TPM_QCed.tsv
curl -O https://www.well.ox.ac.uk/~gav/projects/whg-training-resources/data/data_visualisation/visualising_rna-seq_data/GTEx_gene-annotations.tsv
```
This might take a minute or so to download.

Now make sure your R session is working in the same directory using `setwd()` or the `Session -> Set Working Directory` menu option in RStudio.
:::

The data files are in tab-separated value (TSV) format, which means they are composed of columns, separated by tabular spaces. You can read this type of file into R by using the read.table() function, as specified below:

```r
library( tidyverse )
gtex <- read_tsv( "GTEx-v8-RNAseq_mean-TPM_QCed.tsv" )
gene_annotations <- read_tsv( "GTEx_gene-annotations.tsv" )
```

## Checking the expression data

To check this worked, let's have a closer look at the main expression table by previewing the first 10 rows and columns.
Note how each row corresponds to a gene and each column corresponds to a tissue. Entries in the table contain the
expression levels of each gene in each tissue in TPM units.


```r
print(gtex)
```

You should see something like this:
```r
# A tibble: 14,240 × 55
   gene_name Adipose_Subcutaneous Adipose_Visceral_Omentum Adrenal_Gland Artery_Aorta Artery_Coronary Artery_Tibial Bladder Brain_Amygdala
   <chr>                    <dbl>                    <dbl>         <dbl>        <dbl>           <dbl>         <dbl>   <dbl>          <dbl>
 1 LINC01128                7.44                     7.80           4.03        8.85            8.72         11.1      7.62          2.98 
 2 LINC00115                4.49                     3.42           2.75        6.23            5.94          7.82     7.57          1.45 
 3 SAMD11                   0.476                    2.93           3.78        5.72            3.10          7.93    19.1           0.533
 4 NOC2L                   52.9                     48.2           37.2        55.5            51.9          62.6     71.9          18.3  
 5 KLHL17                   9.68                     8.97           7.89       13.9            13.4          10.7     17.6           3.05 
 6 PLEKHN1                  0.560                    0.648          1.93        0.744           0.868         0.718    4.22          0.107
 7 HES4                    21.8                     24.2            2.91       46.6            64.6          98.4     33.1          16.7  
 8 ISG15                   36.6                     35.0           13.5        50.8            43.7          50.4     33.0          43.6  
 9 AGRN                    18.5                     21.5            4.78       25.3            25.8          22.7     20.0          18.8  
10 C1orf159                 9.30                     6.11           5.08        7.60            8.15          7.57    10.3           5.51 
# ℹ 14,230 more rows
# ℹ 46 more variables: Brain_Anterior_cingulate_cortex_BA24 <dbl>, Brain_Caudate_basal_ganglia <dbl>, Brain_Cerebellar_Hemisphere <dbl>,
#   Brain_Cerebellum <dbl>, Brain_Cortex <dbl>, Brain_Frontal_Cortex_BA9 <dbl>, Brain_Hippocampus <dbl>, Brain_Hypothalamus <dbl>,
#   Brain_Nucleus_accumbens_basal_ganglia <dbl>, Brain_Putamen_basal_ganglia <dbl>, Brain_Spinal_cord_cervical_c1 <dbl>,
#   Brain_Substantia_nigra <dbl>, Breast_Mammary_Tissue <dbl>, Cells_Cultured_fibroblasts <dbl>, Cells_EBV_transformed_lymphocytes <dbl>,
#   Cervix_Ectocervix <dbl>, Cervix_Endocervix <dbl>, Colon_Sigmoid <dbl>, Colon_Transverse <dbl>, Esophagus_Gastroesophageal_Junction <dbl>,
#   Esophagus_Mucosa <dbl>, Esophagus_Muscularis <dbl>, Fallopian_Tube <dbl>, Heart_Atrial_Appendage <dbl>, Heart_Left_Ventricle <dbl>, …
# ℹ Use `print(n = ...)` to see more rows
```

:::tip Note

You've explored tibbles before.  How many rows and columns does the data have?

:::

The data is essentially a big table of expression values.  To work with it more easily, let's convert to a matrix:
```r
gene_names = gtex$gene_name
gtex = as.matrix( gtex[,2:ncol(gtex)] )
row.names( gtex ) = gene_names
```

And print it again:
```
gtex[1:10,1:10]
```
```
          Adipose_Subcutaneous Adipose_Visceral_Omentum Adrenal_Gland Artery_Aorta Artery_Coronary Artery_Tibial  Bladder Brain_Amygdala
LINC01128             7.441180                 7.797220       4.03224     8.845420        8.720360     11.097400  7.62418       2.977490
LINC00115             4.490250                 3.424820       2.75144     6.225130        5.935010      7.817070  7.57255       1.453660
SAMD11                0.476230                 2.931190       3.78499     5.717060        3.104580      7.931910 19.05830       0.532897
NOC2L                52.861400                48.187700      37.17370    55.491600       51.901500     62.564000 71.86850      18.344900
KLHL17                9.678200                 8.967750       7.89155    13.917400       13.392400     10.740400 17.60890       3.048490
PLEKHN1               0.559729                 0.648233       1.92579     0.744398        0.868276      0.717782  4.22114       0.107346
HES4                 21.789300                24.187600       2.91384    46.628900       64.610400     98.388500 33.05170      16.737000
ISG15                36.599900                35.009300      13.45140    50.760100       43.741600     50.375500 32.98460      43.609600
AGRN                 18.538800                21.475700       4.78231    25.299100       25.774100     22.740600 20.00260      18.847400
C1orf159              9.295820                 6.112750       5.07871     7.598480        8.150340      7.573130 10.28930       5.512330
          Brain_Anterior_cingulate_cortex_BA24 Brain_Caudate_basal_ganglia
LINC01128                             4.992650                    3.862590
LINC00115                             1.423120                    2.043400
SAMD11                                0.466223                    2.217410
NOC2L                                27.560400                   25.096000
KLHL17                                5.058480                    4.410430
PLEKHN1                               0.100712                    0.121139
HES4                                 20.636600                   31.458800
ISG15                                25.535200                   27.367600
AGRN                                 22.643900                   19.735000
C1orf159                              6.878150                    6.623100
```

## Checking the gene annotations

Let's also look at the first rows in the gene annotations table. You'll notice that this table contains information pertaining each gene, such as its name, unique ID, genomic location (chromosome, start position, and end position), and its gene family.


```r
print(gene_annotations)
```

```r
# A tibble: 14,240 × 7
   gene_name gene_id         gene_symbol chr     start     end biotype       
   <chr>     <chr>           <chr>       <chr>   <dbl>   <dbl> <chr>         
 1 LINC01128 ENSG00000228794 LINC01128   1      825138  859446 lncRNA        
 2 LINC00115 ENSG00000225880 LINC00115   1      826206  827522 lncRNA        
 3 SAMD11    ENSG00000187634 SAMD11      1      923923  944575 protein_coding
 4 NOC2L     ENSG00000188976 NOC2L       1      944203  959309 protein_coding
 5 KLHL17    ENSG00000187961 KLHL17      1      960584  965719 protein_coding
 6 PLEKHN1   ENSG00000187583 PLEKHN1     1      966482  975865 protein_coding
 7 HES4      ENSG00000188290 HES4        1      998962 1000172 protein_coding
 8 ISG15     ENSG00000187608 ISG15       1     1001138 1014540 protein_coding
 9 AGRN      ENSG00000188157 AGRN        1     1020120 1056118 protein_coding
10 C1orf159  ENSG00000131591 C1orf159    1     1081818 1116361 protein_coding
# ℹ 14,230 more rows
# ℹ Use `print(n = ...)` to see more rows
```

You are now ready to [start exploring this data set](003_visualising.md).

