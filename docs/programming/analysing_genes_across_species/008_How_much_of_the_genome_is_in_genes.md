---
sidebar_position: 10
---

# How much of the genome is in genes?

:::warning Warning - This page is under construction!

It is not complete yet!

:::

If you've followed so far you should have:

- a table `genes` of genes (with some statistics from the ['canonical' transcript](./extreme_genes/003_canonical_transcripts.md)).
- a table `regions` of regions including chromosomes or other contigs, describing the assembly.
- and you should have (or know how to get) other things like a dataframe of `transcripts` and an `exons`.

Let's use this to try to figure out how much of the genome is actually covered by genes.

## Naive approach

You can probably think of a simple approach to this right now using [the dplyr data verbs](./004_filter_join_merge.md). We could

1. group genes by species and chromosome
2. compute the total length by summing
3. join to the `regions` dataset to compute total chromosome/region length
4. and then summarise.

Like this:

```r
lengths = (
   genes
   %>% group_by( dataset, seqid )
   %>% summarise(
      number_of_genes = n(),
      total_gene_length = sum( end - start + 1 )
   )
   %>% left_join(
      regions[, c( "dataset", "seqid", "attributes", "sequence_length" )],
      by = c( "dataset", "seqid" )
   )
)
print( lengths )
```

The idea is that this has both a 'total gene length' (sum of lengths of genes) and the total sequence length (length of
the chromosome or contig) in the same dataframe:

```
# A tibble: 5,469 × 6
# Groups:   dataset [11]
   dataset                                     seqid          number_of_genes total_gene_length attributes                                  sequence_length
   <chr>                                       <chr>                    <int>             <dbl> <chr>                                                 <dbl>
 1 Acanthochromis_polyacanthus.ASM210954v1.110 MVNR01000001.1              56           1349511 Alias=orpheusFish_scaffold1,NW_019029117.1          2466117
 2 Acanthochromis_polyacanthus.ASM210954v1.110 MVNR01000002.1              39           1029333 Alias=orpheusFish_scaffold2,NW_019029118.1          2338421
 3 Acanthochromis_polyacanthus.ASM210954v1.110 MVNR01000003.1              56           1399228 Alias=orpheusFish_scaffold3,NW_019029119.1          2213793
 4 Acanthochromis_polyacanthus.ASM210954v1.110 MVNR01000004.1              41           1113000 Alias=orpheusFish_scaffold4,NW_019029120.1          2013838
 5 Acanthochromis_polyacanthus.ASM210954v1.110 MVNR01000005.1              45           1012078 Alias=orpheusFish_scaffold5,NW_019029121.1          1950346
 6 Acanthochromis_polyacanthus.ASM210954v1.110 MVNR01000006.1              54            989013 Alias=orpheusFish_scaffold6,NW_019029122.1          2094391
 7 Acanthochromis_polyacanthus.ASM210954v1.110 MVNR01000007.1              84           1074990 Alias=orpheusFish_scaffold7,NW_019029123.1          1729193
 8 Acanthochromis_polyacanthus.ASM210954v1.110 MVNR01000008.1              72           1486459 Alias=orpheusFish_scaffold8,NW_019029124.1          2368326
 9 Acanthochromis_polyacanthus.ASM210954v1.110 MVNR01000009.1              50           1237060 Alias=orpheusFish_scaffold9,NW_019029125.1          2396890
10 Acanthochromis_polyacanthus.ASM210954v1.110 MVNR01000010.1              39            643138 Alias=orpheusFish_scaffold10,NW_019029126.1         1656807
# ℹ 5,459 more rows
# ℹ Use `print(n = ...)` to see more rows
```

Now all we have to do is sum them up across chromosomes:
```r
(
   lengths
   %>% group_by( dataset )
   %>% summarise(
      total_gene_length = sum( total_gene_length ),
      total_genome_length = sum( sequence_length )
   )
   %>% mutate(
      proportion_in_genes = total_gene_length / total_genome_length
   )
)
```

```
# A tibble: 11 × 4
   dataset                                           total_gene_length total_genome_length proportion_in_genes
   <chr>                                                         <dbl>               <dbl>               <dbl>
 1 Acanthochromis_polyacanthus.ASM210954v1.110               422171067           830201259               0.509
 2 Asparagus_officinalis.Aspof.V1.57                         165883925          1015569172               0.163
 3 Bufo_bufo-GCA_905171765.1-2022_05-genes                  1290309576          5003028965               0.258
 4 Camelus_dromedarius.CamDro2.110.chr                       825762826          2052758708               0.402
 5 Gallus_gallus.bGalGal1.mat.broiler.GRCg7b.110.chr         583352821          1041139641               0.560
 6 Homo_sapiens.GRCh38.110.chr                              1379802830          3088286401               0.447
 7 Mus_musculus.GRCm39.110.chr                              1070748851          2723431143               0.393
 8 Pan_troglodytes.Pan_tro_3.0.110.chr                      1110722691          2967125077               0.374
 9 Plasmodium_falciparum.ASM276v2.57                          13776689            23292622               0.591
10 Plasmodium_knowlesi.ASM635v1.57                            12970692            23462187               0.553
11 Plasmodium_vivax.ASM241v2.57                               14052272            23768694               0.591
To figure out how much of the genome is covered by genes, or by exons, we face a problem.
In principle we could just add together the gene lengths.
```
Unfortunately this is **wrong**. 

:::tip Question

Why is it wrong?

**Hint**: the numbers are much too large - why?

:::

