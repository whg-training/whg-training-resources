

# Genome annotation files

Now that we had a look at the bases in chromosome 19, let's try to get a deeper understanding of the genomic elements they encode. Genome annotation files are separate from sequence files and can be stored in GFF3 or GTF format. The data we will use is stored as a text file 'Homo_sapiens.GRCh38.107.chromosome.19.gff3'. GRCh38 refers to the name of the assembly - this is the latest 'major release', with 107 referring to the version of minor updates 'minor release'. Let's again use the bash command `head` to inspect the first 20 lines of the GFF file.


```sh
head -n 20 'Homo_sapiens.GRCh38.107.chromosome.19.gff3'
```

```
## ##gff-version 3
## ##sequence-region   19 1 58617616
## #!genome-build Genome Reference Consortium GRCh38.p13
## #!genome-version GRCh38
## #!genome-date 2013-12
## #!genome-build-accession GCA_000001405.28
## #!genebuild-last-updated 2022-04
## 19	GRCh38	chromosome	1	58617616	.	.	.	ID=chromosome:19;Alias=CM000681.2,chr19,NC_000019.10
## ###
## 19	havana	pseudogene	60951	71626	.	-	.	ID=gene:ENSG00000282458;Name=WASH5P;biotype=transcribed_processed_pseudogene;description=WASP family homolog 5%2C pseudogene [Source:HGNC Symbol%3BAcc:HGNC:33884];gene_id=ENSG00000282458;logic_name=havana_homo_sapiens;version=1
## 19	havana	lnc_RNA	60951	70976	.	-	.	ID=transcript:ENST00000632506;Parent=gene:ENSG00000282458;Name=WASH5P-206;biotype=processed_transcript;tag=basic;transcript_id=ENST00000632506;transcript_support_level=1;version=1
## 19	havana	exon	60951	61894	.	-	.	Parent=transcript:ENST00000632506;Name=ENSE00003783010;constitutive=0;ensembl_end_phase=-1;ensembl_phase=-1;exon_id=ENSE00003783010;rank=3;version=1
## 19	havana	exon	66346	66499	.	-	.	Parent=transcript:ENST00000632506;Name=ENSE00003783498;constitutive=0;ensembl_end_phase=-1;ensembl_phase=-1;exon_id=ENSE00003783498;rank=2;version=1
## 19	havana	exon	70928	70976	.	-	.	Parent=transcript:ENST00000632506;Name=ENSE00003781173;constitutive=0;ensembl_end_phase=-1;ensembl_phase=-1;exon_id=ENSE00003781173;rank=1;version=1
## 19	havana	lnc_RNA	62113	66524	.	-	.	ID=transcript:ENST00000633719;Parent=gene:ENSG00000282458;Name=WASH5P-208;biotype=retained_intron;transcript_id=ENST00000633719;transcript_support_level=NA;version=1
## 19	havana	exon	62113	66524	.	-	.	Parent=transcript:ENST00000633719;Name=ENSE00003783013;constitutive=0;ensembl_end_phase=-1;ensembl_phase=-1;exon_id=ENSE00003783013;rank=1;version=1
## 19	havana	lnc_RNA	63821	70951	.	-	.	ID=transcript:ENST00000633703;Parent=gene:ENSG00000282458;Name=WASH5P-207;biotype=processed_transcript;transcript_id=ENST00000633703;transcript_support_level=5;version=1
## 19	havana	exon	63821	64213	.	-	.	Parent=transcript:ENST00000633703;Name=ENSE00003781018;constitutive=0;ensembl_end_phase=-1;ensembl_phase=-1;exon_id=ENSE00003781018;rank=3;version=1
## 19	havana	exon	66346	66499	.	-	.	Parent=transcript:ENST00000633703;Name=ENSE00003783498;constitutive=0;ensembl_end_phase=-1;ensembl_phase=-1;exon_id=ENSE00003783498;rank=2;version=1
## 19	havana	exon	70928	70951	.	-	.	Parent=transcript:ENST00000633703;Name=ENSE00003782721;constitutive=0;ensembl_end_phase=-1;ensembl_phase=-1;exon_id=ENSE00003782721;rank=1;version=1
```

As you can see, there are a few header lines that start with a '\#' specifying some details of the file and the genome build. Next, there is some tab-delimited text split into 9 columns. These are (based on [Ensembl website](https://www.ensembl.org/info/website/upload/gff.html)):

| Coulmn                             | Description                                                                                                                                                                |
|----------------|:-------------------------------------------------------|
| Sequence name (`seqname`)          | Name of the chromosome or scaffold. Watch out for differences between annotation consortia. Chromosome 1 could be denoted as 'chr1' or just '1'.                           |
| Source (`source`)                  | Annotation source. Includes 'ensembl' - automatic annotation program and 'havana' - manual annotation by HAVANA group.                                                     |
| Feature type (`feature` or `type`) | Region type. Can be coding sequence (CDS), exon (exon), 3' UTR (three_prime_UTR), 5' UTR (five_prime_UTR), and more, depending on the annotation source.                   |
| Start (`start`)                    | Genomic coordinate where the annotated sequence starts.                                                                                                                    |
| End (`end`)                        | Genomic coordinate where the annotated sequence ends.                                                                                                                      |
| Score (`score`)                    | A numeric value normally referring to the confidence score of the annotated sequence.                                                                                      |
| Strand (`strand`)                  | Direction of the sequence in double-stranded DNA. Can be either '+' (forward/sense strand) or '-' (reverse/antisense strand).                                              |
| ORF (`frame`)                      | Refers to the start of the open reading frame (ORF). Can be '0', '1', or '2' - '0' indicates that the first base of the feature is the first base of a codon.              |
| Attributes (`attribute`)           | A list of name-value pairs separated by semicolons, in the format 'name=value'. Attributes differ in type and number based on the feature type and the annotation program. |

A dot in any column '.' indicates no value.

Let's try base R function `read.delim()`, which reads any delimited file (tab, comma, etc.), to read the GFF into memory and examine it. As the GFF does not include column names, we will specify `header = F` and tell R to ignore all the lines that start with '\#' using the argument `comment.char` - these happen to be default parameters of function `read.delim()`, but it is a good practice to be explicit about the function arguments in your code. We will give the columns meaningful names.


```r
gff <- read.delim('Homo_sapiens.GRCh38.107.chromosome.19.gff3',
                  comment.char = '#',
                  header = FALSE,
                  col.names = c('seqname', 'source', 'type', 'start', 'end', 'score', 'strand', 'frame', 'attribute'))

head(gff)
```

```
##   seqname source       type start      end score strand frame
## 1      19 GRCh38 chromosome     1 58617616     .      .     .
## 2      19 havana pseudogene 60951    71626     .      -     .
## 3      19 havana    lnc_RNA 60951    70976     .      -     .
## 4      19 havana       exon 60951    61894     .      -     .
## 5      19 havana       exon 66346    66499     .      -     .
## 6      19 havana       exon 70928    70976     .      -     .
##                                                                                                                                                                                                                             attribute
## 1                                                                                                                                                                                ID=chromosome:19;Alias=CM000681.2,chr19,NC_000019.10
## 2 ID=gene:ENSG00000282458;Name=WASH5P;biotype=transcribed_processed_pseudogene;description=WASP family homolog 5%2C pseudogene [Source:HGNC Symbol%3BAcc:HGNC:33884];gene_id=ENSG00000282458;logic_name=havana_homo_sapiens;version=1
## 3                                                 ID=transcript:ENST00000632506;Parent=gene:ENSG00000282458;Name=WASH5P-206;biotype=processed_transcript;tag=basic;transcript_id=ENST00000632506;transcript_support_level=1;version=1
## 4                                                                                Parent=transcript:ENST00000632506;Name=ENSE00003783010;constitutive=0;ensembl_end_phase=-1;ensembl_phase=-1;exon_id=ENSE00003783010;rank=3;version=1
## 5                                                                                Parent=transcript:ENST00000632506;Name=ENSE00003783498;constitutive=0;ensembl_end_phase=-1;ensembl_phase=-1;exon_id=ENSE00003783498;rank=2;version=1
## 6                                                                                Parent=transcript:ENST00000632506;Name=ENSE00003781173;constitutive=0;ensembl_end_phase=-1;ensembl_phase=-1;exon_id=ENSE00003781173;rank=1;version=1
```

As you can see, the first 8 columns are readily readable, but the column 'attribute' poses a challenge. We need the information contained in it to understand which gene the sequences relate to (most genes will have multiple rows associated with them)! We could write a function that splits the 'attribute' sting based on the ';' character, then split the resulting strings based on '=' character and separate them into columns. If you are a more advanced R user (including regex) and feel like a challenge, you can try coding this up - Google is your friend! For now, we will use an existing package `rtracklayer` to read the GFF into R's memory and convert it to a familiar data frame format.


```r
gff <- readGFF('Homo_sapiens.GRCh38.107.chromosome.19.gff3')
gff <- as.data.frame(gff)
head(gff)
```

```
##   seqid source       type start      end score strand phase
## 1    19 GRCh38 chromosome     1 58617616    NA      *    NA
## 2    19 havana pseudogene 60951    71626    NA      -    NA
## 3    19 havana    lnc_RNA 60951    70976    NA      -    NA
## 4    19 havana       exon 60951    61894    NA      -    NA
## 5    19 havana       exon 66346    66499    NA      -    NA
## 6    19 havana       exon 70928    70976    NA      -    NA
##                           ID        Alias            Name
## 1              chromosome:19 CM000681....            <NA>
## 2       gene:ENSG00000282458                       WASH5P
## 3 transcript:ENST00000632506                   WASH5P-206
## 4                       <NA>              ENSE00003783010
## 5                       <NA>              ENSE00003783498
## 6                       <NA>              ENSE00003781173
##                            biotype
## 1                             <NA>
## 2 transcribed_processed_pseudogene
## 3             processed_transcript
## 4                             <NA>
## 5                             <NA>
## 6                             <NA>
##                                                             description
## 1                                                                  <NA>
## 2 WASP family homolog 5, pseudogene [Source:HGNC Symbol;Acc:HGNC:33884]
## 3                                                                  <NA>
## 4                                                                  <NA>
## 5                                                                  <NA>
## 6                                                                  <NA>
##           gene_id          logic_name version       Parent   tag
## 1            <NA>                <NA>    <NA>               <NA>
## 2 ENSG00000282458 havana_homo_sapiens       1               <NA>
## 3            <NA>                <NA>       1 gene:ENS.... basic
## 4            <NA>                <NA>       1 transcri....  <NA>
## 5            <NA>                <NA>       1 transcri....  <NA>
## 6            <NA>                <NA>       1 transcri....  <NA>
##     transcript_id transcript_support_level constitutive ensembl_end_phase
## 1            <NA>                     <NA>         <NA>              <NA>
## 2            <NA>                     <NA>         <NA>              <NA>
## 3 ENST00000632506                        1         <NA>              <NA>
## 4            <NA>                     <NA>            0                -1
## 5            <NA>                     <NA>            0                -1
## 6            <NA>                     <NA>            0                -1
##   ensembl_phase         exon_id rank external_name ccdsid protein_id
## 1          <NA>            <NA> <NA>          <NA>   <NA>       <NA>
## 2          <NA>            <NA> <NA>          <NA>   <NA>       <NA>
## 3          <NA>            <NA> <NA>          <NA>   <NA>       <NA>
## 4            -1 ENSE00003783010    3          <NA>   <NA>       <NA>
## 5            -1 ENSE00003783498    2          <NA>   <NA>       <NA>
## 6            -1 ENSE00003781173    1          <NA>   <NA>       <NA>
```

OK, this is much better! Every attribute now sits in its own column, and there is an 'NA' value if the information for that row is missing. Let's save the length of chromosome 19 (first row of the data frame) which will become useful later and subset the GFF file so that it contains automatic annotations generated by Ensembl merged with manual annotations by HAVANA group. Read more about those on the [Ensembl website](https://www.ensembl.org/info/genome/genebuild/annotation_merge.html).

Recall that subsetting in R is possible using square brackets `[ ]` or the function `subset()`.


```r
chr19 <- gff[1, ]
gff <- subset(gff, source == 'ensembl_havana')
```

To calculate the number of genes, we will use the column 'type' and select 'gene'. The gff\$type == 'gene' will return a boolean (TRUE/FALSE) value for every row in the dataframe. To count the number of 'TRUE' values, we will use the property that TRUE is equal to 1 and FALSE is equal to 0. Therefore, sum of TRUE occurences is the number of rows that correspond to gene annotation in our GFF file


```r
head(gff$type == 'gene') #This returns a long boolean
```

```
## [1]  TRUE  TRUE FALSE FALSE FALSE FALSE
```

```r
sum(gff$type == 'gene') #This counts the number of 'TRUE' occurences
```

```
## [1] 1343
```

Let/s take a closer look at the genes on chromosome 19. To do this, we will subset the original data frame to only include gene annotations. We can see that the number of rows in this new data frame is equal to the number we calculated before.


```r
genes <- gff[gff$type == 'gene', ]  #Subset the data frame

nrow(genes) #Number of genes equal to what we calculated before
```

```
## [1] 1343
```

It would be interesting to see what proportion of genes lie on each strand of the DNA, denoted as + (sense) and - (antisense) in the gff file. We can produce count summaries using the fuction `table()`.


```r
table(genes$strand)
```

```
## 
##   -   + 
## 665 678
```

We can see that the proportion of genes on either strand is approximately equal.

What about genome coverage? How much of the genome is actually used to encode information about genes? Let's calculate the proportion of DNA occupied by coding sequences in relation to the chromosome length.


```r
cds <- gff[gff$type == 'CDS', ]
cds$length <- cds$end - cds$start

sum(cds$length) / (chr19$end - chr19$start)
```

```
## [1] 0.04460002
```

Can you carry out a similar calculation to see how much of the genome is covered by exons?


```r
regions <- gff[gff$type%in% c('CDS', 'three_prime_UTR', 'five_prime_UTR'), ]
regions$length <- regions$end - regions$start

region_lengths <- data.frame()      #Create a data frame object to store the results
for (type in c('CDS', 'three_prime_UTR', 'five_prime_UTR')){
  region_lengths[type, 'length'] <- sum(regions[regions$type == type, 'length'])    #Calculate sum of lengths for each region
}

barplot(region_lengths$length, names.arg = rownames(region_lengths))
```

![img](./images/image1.png)

Can you hypothesise why the 3' UTR sequences are, on average, longer than 5'?

We can see that, as suspected, coding sequences are the longest fragments of coding DNA. But we also saw that the coding DNA forms only a small fraction of the genome. To visualise this, let's now add the length of the entire chromosome 19 for scale!


```r
region_lengths['chromosome', 'length'] <- chr19$end - chr19$start

barplot(region_lengths$length, names.arg = rownames(region_lengths))
```

![img](./images/image2.png)

Let's look at some interesting genes on chromosome 19. We will look at a class of enzymes called fucosyltarnsferases, which are involved in chemical modification of glycans displayed on the cell surface. There are 13 of them in the entire genome, let's see how many on chromosome 13 - their symbols all start with 'FUT'.


```r
FUTs <- grep(pattern = 'FUT', gff$Name, value = TRUE) #Find all the gene names that contain 'FUT'
FUTs
```

```
##  [1] "FUT6"     "FUT6-202" "FUT6-201" "FUT3"     "FUT3-201" "FUT3-202"
##  [7] "FUT5"     "FUT2"     "FUT2-202" "FUT1"     "FUT1-206"
```

This is interewsting - there is some gene symbols as well as gene symbols with a dash and a number. Let's take a closer look at their annotations.


```r
subset(gff, Name %in% FUTs)
```

```
##        seqid         source type    start      end score strand phase
## 23031     19 ensembl_havana gene  5830408  5839722    NA      -    NA
## 23032     19 ensembl_havana mRNA  5830408  5839702    NA      -    NA
## 23061     19 ensembl_havana mRNA  5830774  5839717    NA      -    NA
## 23117     19 ensembl_havana gene  5842888  5851471    NA      -    NA
## 23118     19 ensembl_havana mRNA  5842888  5851449    NA      -    NA
## 23136     19 ensembl_havana mRNA  5842890  5851449    NA      -    NA
## 23198     19 ensembl_havana gene  5865826  5870540    NA      -    NA
## 147878    19 ensembl_havana gene 48695971 48705951    NA      +    NA
## 147886    19 ensembl_havana mRNA 48695971 48705951    NA      +    NA
## 148150    19 ensembl_havana gene 48748011 48755390    NA      -    NA
## 148151    19 ensembl_havana mRNA 48748011 48752641    NA      -    NA
##                                ID Alias     Name        biotype
## 23031        gene:ENSG00000156413           FUT6 protein_coding
## 23032  transcript:ENST00000318336       FUT6-202 protein_coding
## 23061  transcript:ENST00000286955       FUT6-201 protein_coding
## 23117        gene:ENSG00000171124           FUT3 protein_coding
## 23118  transcript:ENST00000303225       FUT3-201 protein_coding
## 23136  transcript:ENST00000458379       FUT3-202 protein_coding
## 23198        gene:ENSG00000130383           FUT5 protein_coding
## 147878       gene:ENSG00000176920           FUT2 protein_coding
## 147886 transcript:ENST00000425340       FUT2-202 protein_coding
## 148150       gene:ENSG00000174951           FUT1 protein_coding
## 148151 transcript:ENST00000645652       FUT1-206 protein_coding
##                                                                        description
## 23031                      fucosyltransferase 6 [Source:HGNC Symbol;Acc:HGNC:4017]
## 23032                                                                         <NA>
## 23061                                                                         <NA>
## 23117  fucosyltransferase 3 (Lewis blood group) [Source:HGNC Symbol;Acc:HGNC:4014]
## 23118                                                                         <NA>
## 23136                                                                         <NA>
## 23198                      fucosyltransferase 5 [Source:HGNC Symbol;Acc:HGNC:4016]
## 147878                     fucosyltransferase 2 [Source:HGNC Symbol;Acc:HGNC:4013]
## 147886                                                                        <NA>
## 148150     fucosyltransferase 1 (H blood group) [Source:HGNC Symbol;Acc:HGNC:4012]
## 148151                                                                        <NA>
##                gene_id                       logic_name version       Parent
## 23031  ENSG00000156413 ensembl_havana_gene_homo_sapiens      15             
## 23032             <NA>                             <NA>      10 gene:ENS....
## 23061             <NA>                             <NA>       5 gene:ENS....
## 23117  ENSG00000171124 ensembl_havana_gene_homo_sapiens      14             
## 23118             <NA>                             <NA>      12 gene:ENS....
## 23136             <NA>                             <NA>       7 gene:ENS....
## 23198  ENSG00000130383 ensembl_havana_gene_homo_sapiens       7             
## 147878 ENSG00000176920 ensembl_havana_gene_homo_sapiens      13             
## 147886            <NA>                             <NA>       3 gene:ENS....
## 148150 ENSG00000174951 ensembl_havana_gene_homo_sapiens      12             
## 148151            <NA>                             <NA>       2 gene:ENS....
##          tag   transcript_id            transcript_support_level constitutive
## 23031   <NA>            <NA>                                <NA>         <NA>
## 23032  basic ENST00000318336  2 (assigned to previous version 8)         <NA>
## 23061  basic ENST00000286955                                   1         <NA>
## 23117   <NA>            <NA>                                <NA>         <NA>
## 23118  basic ENST00000303225 1 (assigned to previous version 10)         <NA>
## 23136  basic ENST00000458379  1 (assigned to previous version 6)         <NA>
## 23198   <NA>            <NA>                                <NA>         <NA>
## 147878  <NA>            <NA>                                <NA>         <NA>
## 147886 basic ENST00000425340  1 (assigned to previous version 2)         <NA>
## 148150  <NA>            <NA>                                <NA>         <NA>
## 148151 basic ENST00000645652                                <NA>         <NA>
##        ensembl_end_phase ensembl_phase exon_id rank external_name      ccdsid
## 23031               <NA>          <NA>    <NA> <NA>          <NA>        <NA>
## 23032               <NA>          <NA>    <NA> <NA>          <NA> CCDS12152.1
## 23061               <NA>          <NA>    <NA> <NA>          <NA> CCDS12152.1
## 23117               <NA>          <NA>    <NA> <NA>          <NA>        <NA>
## 23118               <NA>          <NA>    <NA> <NA>          <NA> CCDS12153.1
## 23136               <NA>          <NA>    <NA> <NA>          <NA> CCDS12153.1
## 23198               <NA>          <NA>    <NA> <NA>          <NA>        <NA>
## 147878              <NA>          <NA>    <NA> <NA>          <NA>        <NA>
## 147886              <NA>          <NA>    <NA> <NA>          <NA> CCDS33069.1
## 148150              <NA>          <NA>    <NA> <NA>          <NA>        <NA>
## 148151              <NA>          <NA>    <NA> <NA>          <NA> CCDS12733.1
##        protein_id
## 23031        <NA>
## 23032        <NA>
## 23061        <NA>
## 23117        <NA>
## 23118        <NA>
## 23136        <NA>
## 23198        <NA>
## 147878       <NA>
## 147886       <NA>
## 148150       <NA>
## 148151       <NA>
```

Bingo! Some annotations are for the genes and the others correspond to mRNA transcripts (those with the dashes). We are only interested in the genes, so let's modify our search to reflect that.


```r
FUTs <- grep('\\-', FUTs, value = TRUE, invert = TRUE) #\\ is an escape character, which tells grep to look for an actual dash, not a dash symbol with a special meaning.
                                                    #Invert tells grep to exclude genes containing a dash.

FUTs_df <- subset(gff, Name %in% FUTs)
FUTs_df
```

```
##        seqid         source type    start      end score strand phase
## 23031     19 ensembl_havana gene  5830408  5839722    NA      -    NA
## 23117     19 ensembl_havana gene  5842888  5851471    NA      -    NA
## 23198     19 ensembl_havana gene  5865826  5870540    NA      -    NA
## 147878    19 ensembl_havana gene 48695971 48705951    NA      +    NA
## 148150    19 ensembl_havana gene 48748011 48755390    NA      -    NA
##                          ID Alias Name        biotype
## 23031  gene:ENSG00000156413       FUT6 protein_coding
## 23117  gene:ENSG00000171124       FUT3 protein_coding
## 23198  gene:ENSG00000130383       FUT5 protein_coding
## 147878 gene:ENSG00000176920       FUT2 protein_coding
## 148150 gene:ENSG00000174951       FUT1 protein_coding
##                                                                        description
## 23031                      fucosyltransferase 6 [Source:HGNC Symbol;Acc:HGNC:4017]
## 23117  fucosyltransferase 3 (Lewis blood group) [Source:HGNC Symbol;Acc:HGNC:4014]
## 23198                      fucosyltransferase 5 [Source:HGNC Symbol;Acc:HGNC:4016]
## 147878                     fucosyltransferase 2 [Source:HGNC Symbol;Acc:HGNC:4013]
## 148150     fucosyltransferase 1 (H blood group) [Source:HGNC Symbol;Acc:HGNC:4012]
##                gene_id                       logic_name version Parent  tag
## 23031  ENSG00000156413 ensembl_havana_gene_homo_sapiens      15        <NA>
## 23117  ENSG00000171124 ensembl_havana_gene_homo_sapiens      14        <NA>
## 23198  ENSG00000130383 ensembl_havana_gene_homo_sapiens       7        <NA>
## 147878 ENSG00000176920 ensembl_havana_gene_homo_sapiens      13        <NA>
## 148150 ENSG00000174951 ensembl_havana_gene_homo_sapiens      12        <NA>
##        transcript_id transcript_support_level constitutive ensembl_end_phase
## 23031           <NA>                     <NA>         <NA>              <NA>
## 23117           <NA>                     <NA>         <NA>              <NA>
## 23198           <NA>                     <NA>         <NA>              <NA>
## 147878          <NA>                     <NA>         <NA>              <NA>
## 148150          <NA>                     <NA>         <NA>              <NA>
##        ensembl_phase exon_id rank external_name ccdsid protein_id
## 23031           <NA>    <NA> <NA>          <NA>   <NA>       <NA>
## 23117           <NA>    <NA> <NA>          <NA>   <NA>       <NA>
## 23198           <NA>    <NA> <NA>          <NA>   <NA>       <NA>
## 147878          <NA>    <NA> <NA>          <NA>   <NA>       <NA>
## 148150          <NA>    <NA> <NA>          <NA>   <NA>       <NA>
```

Let's visualise the relative placement of all the FUT genes using a genome browser. We will use GenomicRanges object, which is a compact way of storing sequence information. We will then use Gviz package to create 'tracks' (in our case, the reference track will be empty, but it can contain information about the genome).


```r
FUTs_gr <- with(FUTs_df, GRanges(seqid, IRanges(start, end), strand, id = Name))
 
chr_track <- IdeogramTrack(genome = 'hg38', chromosome = 'chr19')   #This creates a chromosome 'ideogram', or a graphic, with cytological bands, based on corresponding data from UCSC (a repository like Ensembl)
ref_track <- GenomeAxisTrack()    #This creates an empty track where our genes will be displayed
data_track <- AnnotationTrack(FUTs_gr, name = "Genes", showFeatureId = TRUE)    #This creates the annotations to display
```

When inspecting the data frame `FUTs_df`, above, you can see that there are two gene clusters of fucosyltransferase genes, one in the 5.8Mb (megabase, 1e6 bases) and one in the 48.7Mb region. We will plot these two regions separately as they are far apart.


```r
#Cluster 1
plotTracks(c(chr_track, ref_track, data_track),
           from = 5.82e6, to = 5.88e6, sizes = c(1,1,2))
```

![img](./images/image3.png)

```r
#Cluster 2
plotTracks(c(chr_track, ref_track, data_track),
           from = 48.68e6, to = 48.76e6, sizes = c(1,1,2))
```

![img](./images/image4.png)

Feel free to change the `from` and `to` values to zoom in and out of the loci. You can also produce some code that will automatically establish the optimal region to show using functions `min()`, `max()`, and the arguments `extend.right`/`extend.left` of the function `plotTracks`. The arrows indicate transcript directionality (remember '+' and '-' strands from our GFF? they correspond to right- and left-pointing arrow, respectively).
