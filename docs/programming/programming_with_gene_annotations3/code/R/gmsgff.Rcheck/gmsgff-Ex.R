pkgname <- "gmsgff"
source(file.path(R.home("share"), "R", "examples-header.R"))
options(warn = 1)
library('gmsgff')

base::assign(".oldSearch", base::search(), pos = 'CheckExEnv')
base::assign(".old_wd", base::getwd(), pos = 'CheckExEnv')
cleanEx()
nameEx("gmsgff-package")
### * gmsgff-package

flush(stderr()); flush(stdout())

### Name: gmsgff-package
### Title: Utilities for loading gene annotation data
### Aliases: gmsgff-package gmsgff
### Keywords: package

### ** Examples

gmsgff::parse_gff3_to_dataframe( "##gff-version 3
#description: test data
chr1\tme\tgene\t1\t1000\t.\t+\t.\tID=gene1;other_data=stuff
chr1\tme\texon\t10\t900\t.\t+\t.\tID=gene1.1;Parent=gene1
" )



cleanEx()
nameEx("parse_gff3_to_dataframe")
### * parse_gff3_to_dataframe

flush(stderr()); flush(stdout())

### Name: parse_gff3_to_dataframe
### Title: Parse a gff file to a tidyverse dataframe
### Aliases: parse_gff3_to_dataframe

### ** Examples

gencode = gmsgff::parse_gff3_to_dataframe( "##gff-version 3
#description: test data
chr1\tme\tgene\t1\t1000\t.\t+\t.\tID=gene1;other_data=stuff
chr1\tme\texon\t10\t900\t.\t+\t.\tID=gene1.1;Parent=gene1
" )



### * <FOOTER>
###
cleanEx()
options(digits = 7L)
base::cat("Time elapsed: ", proc.time() - base::get("ptime", pos = 'CheckExEnv'),"\n")
grDevices::dev.off()
###
### Local variables: ***
### mode: outline-minor ***
### outline-regexp: "\\(> \\)?### [*]+" ***
### End: ***
quit('no')
