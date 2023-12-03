---
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Counting genes

For simplicity, from here on in we will work with the GFF3 files from the [Ensembl ftp
site](http://ftp.ensembl.org/pub/current_gff3/) (vertebrate genomes) or from [Ensembl
genomes](https://ftp.ensemblgenomes.ebi.ac.uk/pub/) (non-vertebrate genomes). These use the terminology `mRNA` for a
gene transcript, and they also have the genome sequence lengths written in the metadata, making life easy for us. Before
starting, download some of these files now. 

We will focus on protein-coding genes, and their transcripts, exons and coding sequence. They have type `gene`, `mRNA`,
`exon` and `CDS` in the files Ensembl respectively. They come in a basic hierarchy:

- Each gene can have multiple transcripts (i.e. multiple expressed forms at mRNA level - e.g. they
  might differ in how exons are spliced together, or have different transcription start or end
  sites).
  
- Each transcript is made up of one or more exons. The introns in between are spliced out. (This
  happens during the transcription process.)

- Of the exon sequence that makes it into a transcript, only a portion is actually translated into
  the mature protein during processing by the ribosomes. This is the *coding sequence* and the rest
  is *untranslated sequence*.

The files we're looking are (roughly speaking) humanities' best guess at what this picture looks like in each organism.

## Getting data

I'm going to assume you have found a set of files from the [Ensembl ftp site](http://ftp.ensembl.org/pub/current_gff3/) or
elsewhere, and run them through your `gff_to_sqlite.R` program to get them into a database - say `genes.sqlite`. If not
**please go and do that now**.  For example, like this:
```
Rscript --vanilla gff_to_sqlite.R --attributes Name biotype --input http://ftp.ensembl.org/pub/current_gff3/homo_sapiens/Homo_sapiens.GRCh38.110.chr.gff3.gz --output genes.sqlite
Rscript --vanilla gff_to_sqlite.R --attributes Name biotype --input http://ftp.ensembl.org/pub/current_gff3/pan_troglodytes/Pan_troglodytes.Pan_tro_3.0.110.chr.gff3.gz --output genes.sqlite
Rscript --vanilla gff_to_sqlite.R --attributes Name biotype --input http://ftp.ensembl.org/pub/current_gff3/camelus_dromedarius/Camelus_dromedarius.CamDro2.110.chr.gff3.gz --output genes.sqlite
# ...and so on
```

I suggest to pick a few species for now - choose ones that interest you.  

:::tip Note

There are a lot to choose from.  For example you can get:

* Vertebrate genomes from [Ensembl](http://ftp.ensembl.org/pub/current_gff3/)
* Protists from [Ensembl protists](https://ftp.ensemblgenomes.ebi.ac.uk/pub/protists/current/gff3/)
* Fungi from [Ensembl fungi](https://ftp.ensemblgenomes.ebi.ac.uk/pub/fungi/current/gff3/)
* Plants from [Ensembl plants](https://ftp.ensemblgenomes.ebi.ac.uk/pub/plants/current/gff3/)
* or Bacteria from [Ensembl bacteria](https://ftp.ensemblgenomes.ebi.ac.uk/pub/bacteria/current/gff3/)

Yet another place to look is the [Darwin Tree of Life Data Portal](https://portal.darwintreeoflife.org), which at the
time of writing has nearly 300 genomes in 'Annotation complete' state.
:::

:::tip What are all those species?

If you're confused about how all those species relate, it's time to look at [OneZoom.org](http://www.onezoom.org):

<iframe src="http://www.onezoom.org" width ="100%" height="800px"> 
</iframe>

For example, did you know that Dolphins, like Camels, are [cloven-hoofed
ungulates](http://www.onezoom.org/life/@Cetartiodactyla=622916)?  Did you know that all species of ape - except humans -
are [endangered or critically
endangered](http://www.onezoom.org/life/@Catarrhini=842867?img=best_any&anim=flight#x-1130,y379,w6.2977)?

Another place to look is  the [Ensembl species list](https://www.ensembl.org/info/about/species.html) and the [Ensembl
species tree](https://www.ensembl.org/info/about/speciestree.html).  There are also similar pages for each of the
branches of life on the [Ensembl Genomes](https://ensemblgenomes.org) site.

:::

Pick some genomes to start with and load them into your database.  Once done, you are actually in a good shape for many
of our scientific questions.  Let's start by counting genes:

## Counting genes in sqlite

A simple way to count genes is to use sqlite. For example using the sqlite file you created in the last step, you can count all gene records like this:

```sh
sqlite> SELECT COUNT(*) FROM gff WHERE type == 'gene' ;
```

:::tip Note

To run the above, you have to be working interactively in sqlite3 - you get there by typing `sqlite3 genes.sqlite` in
the shell. Type `.quit` again when you want to quit.  

Alternatively you can run from the shell directly, for example to produce a csv file with column names:
```sh
% sqlite3 -csv -header genes.sqlite "SELECT COUNT(*) FROM gff WHERE type == 'gene'"
```

:::

Of course, that just counts all the genes in the file - we'd like it split by species.  Simple! If you followed the
suggestions above your file will also have a `dataset` column that lets you differentiate the records for different
species. So you can make these counts for multiple species:

```
sqlite> .mode column
sqlite> .header on
sqlite> SELECT dataset, COUNT(*) FROM gff WHERE type=='gene' GROUP BY dataset ;
```

In my data, which includes spiny chromis, dromedary camels, red junglefowl, humans, mice, chimpanzees, and
malaria parasites, this gives:

    dataset                                      COUNT(*)  
    -------------------------------------------  ----------
    Acanthochromis_polyacanthus.ASM210954v1.104  24027     
    Camelus_dromedarius.CamDro2.104.chr.gff3     18919     
    Gallus_gallus.GRCg6a.104                     16666     
    Homo_sapiens.GRCh38.104                      21451     
    Mus_musculus.GRCm39.104                      25655     
    Pan_troglodytes.Pan_tro_3.0.104.chr          22056     
    PlasmoDB-54_Pfalciparum3D7                   5318      

Interestingly, both [house mice](https://en.wikipedia.org/wiki/House_mouse) and [spiny
chromis](https://en.wikipedia.org/wiki/Spiny_chromis) have more (annotated) genes than humans.
Chimpanzees have a similar number, while [Red
junglefowl](https://en.wikipedia.org/wiki/Red_junglefowl) and [Dromedary
Camels](https://en.wikipedia.org/wiki/Dromedary) have respectively 17% and 5% fewer (annotated)
protein-coding genes than humans. *Plasmodium falciparum* has about a quarter of the number of
genes. (But that's still pretty impressive because its genome size is less than a hundredth that of
humans.)


:::tip Note
To make the above query work the [*P.falciparum* data from
PlasmoDB](https://plasmodb.org/plasmo/app/downloads/Current_Release/), I kludged it by running this sql:
```
UPDATE gff
SET type = 'gene', biotype = 'protein_coding'
WHERE dataset LIKE 'PlasmoDB-%_Pfalciparum3D7'
AND type == 'protein_coding_gene' ;
```

I wouldn't generally recommend this type of manually-fix-the-data-until-it-works approach
(not least because it would have to be re-done every time we imported new data) but it'll do for this tutorial.
:::

## Counting genes in R or python

So how would we do this in R or python?  One of the messages of this tutorial is that the same operations are generally
possible in different languages, with minor differences in syntax.  The tabs below show a few different ways:

<Tabs>
<TabItem value="R" label="R code">

First we will load the whole dataframe into R.  To do this we have to open a 'connection' to the database and then read
from it.  (We'll filter down to genes here as well, so that we don't use up too much memory).

```r
library( RSQLite )
library( dplyr )
db = DBI::dbConnect( RSQLite::SQLite(), "genes.sqlite" )
genes = dbGetQuery( db, "SELECT * FROM gff WHERE type == 'gene'" )
```

Now let's group by dataset, and summarise just as we did in sql:
```r
(
    genes
    %>% group_by( dataset )
    %>% summarise( count = n() )
)
```
You should see the same output as above, but now in R:
```
# A tibble: 7 × 2
  dataset                                                count
  <chr>                                                  <int>
1 Acanthochromis_polyacanthus.ASM210954v1.110.gff3       24027
2 Camelus_dromedarius.CamDro2.110.chr.gff3               18919
3 Gallus_gallus.bGalGal1.mat.broiler.GRCg7b.110.chr.gff3 18121
4 Homo_sapiens.GRCh38.110.chr.gff3                       21532
5 Mus_musculus.GRCm39.110.chr.gff3                        5946
6 Pan_troglodytes.Pan_tro_3.0.110.chr.gff3               22056
7 PlasmoDB-65_Pfalciparum3D7                              5318
```

</TabItem>
<TabItem value="Rsql" label="R and sql combined">

Of course there's no particular reason not to combine R and sql in the same code:

```r
dbGetQuery( db, "SELECT dataset, COUNT(*) FROM gff WHERE type=='gene' GROUP BY dataset" )
```

```
                                                 dataset COUNT(*)
1       Acanthochromis_polyacanthus.ASM210954v1.110.gff3    24027
2               Camelus_dromedarius.CamDro2.110.chr.gff3    18919
3 Gallus_gallus.bGalGal1.mat.broiler.GRCg7b.110.chr.gff3    18121
4                       Homo_sapiens.GRCh38.110.chr.gff3    21532
5                       Mus_musculus.GRCm39.110.chr.gff3     5946
6               Pan_troglodytes.Pan_tro_3.0.110.chr.gff3    22056
7                             PlasmoDB-65_Pfalciparum3D7     5318
```

(Use `as_tibble()` if you want this in the form of a tidyverse tibble).

This has one **big advantage** over the plain R code - it doesn't load the whole dataframe into R,
but just the result of the query.

The same advantage can be had by using [dbplyr](dbplyr.tidyverse.org]) as well - see the next tab.

</TabItem>
<TabItem value="dbplyR" label="dbplyr code">

Another way to do this uses [dbplyr](https://dbplyr.tidyverse.org).  dbplyr works just like dplyr, but transforms
its work into database queries under the hood.  

To try this, make sure you have a connection `db` to the database (as on the 'R' tab).  You then use the dbplyr `tbl()`
function to represent a database table of data which you can then operate on.  LIie this:

```
(
  db
  %>% tbl( "gff" )
  %>% filter( type == 'gene' )
  %>% group_by( dataset )
  %>% summarise (count = n() )
  %>% collect()
)
```

Interestingly, although this looks like R code, it is actually translating to sql code under the hood.  To see this, try
re-running it but changing the `collect()` call to `show_query()`.  You should see:

```
SELECT `dataset`, COUNT(*) AS `count`
FROM `gff`
WHERE (`type` = 'gene')
GROUP BY `dataset`
```

In other words, dbplyr has worked out for itself how to crate the right query above from the R code.  LIke the combined
R-and-sql code, this has only loaded the bits of data it needs, not the whole dataframe, into memory.

</TabItem>
<TabItem value="python" label="Python code">

This can of course also be done in python / pandas.  First connect to the database:

```python
import pandas, sqlite3
db = sqlite3.connect( "genes.sqlite" )
```

And then read from it using [read_sql](https://pandas.pydata.org/docs/reference/api/pandas.read_sql.html):
```python
genes = pandas.read_sql( "SELECT * FROM gff WHERE type == 'gene'", db )
```
Now let's group by datasets, and summarise just as we did in sql:

```python
(
    genes
    .groupby( "dataset" )
    .size()
)
```

This produces:

    dataset
    Acanthochromis_polyacanthus.ASM210954v1.104    24027
    Camelus_dromedarius.CamDro2.104.chr.gff3       18919
    Gallus_gallus.GRCg6a.104                       16666
    Homo_sapiens.GRCh38.104                        21451
    Mus_musculus.GRCm39.104                        25655
    Pan_troglodytes.Pan_tro_3.0.104.chr            22056
    PlasmoDB-54_Pfalciparum3D7                      5318
    dtype: int64

</TabItem>

</Tabs>
