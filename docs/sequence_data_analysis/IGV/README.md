---
sidebar_position: 3
---

# Exploring Reads in IGV

**Contributors**:  Gavin Band, Annie Forster

## Getting the data

In this tutorial you are going to be inspecting read alignments in a program called [Integrative Genomics
Viewer](https://software.broadinstitute.org/software/igv), or IGV for short. IGV is a very handy piece of software which allows you to visually inspect alignments across the genome. 

First you will need to download IGV. You can find the software
[here](https://software.broadinstitute.org/software/igv/download) - please download and install it now.

For this tutorial we will use sequencing data from *P.falciparum* malaria parasites. If you completed the earlier
tutorial [on paired-end sequencing](../introduction_to_next_generation_sequencing_data_analysis/), or the [pipelining
tutorial](../building_an_ngs_pipeline/) you will already have some aligned BAM files which you can use for this.  For this tutorial you should load (at least) these files:

* `QG0033-C.bam`
* `QG0041-C.bam`

You are also welcome to load and look at others as well.

:::tip Note

Alternatively, my versions of the aligned files can be found [in this
folder](https://www.well.ox.ac.uk/~gav/projects/whg-training-resources/data/sequence_data_analysis/building_an_ngs_pipeline/results/aligned).

You'll need to download one or more of these to your computer - make sure to download the corresponding BAM index (`.bai`) files as well.  The download may take a few minutes to complete.

:::

If you followed the [snakemake tutorial](../building_an_ngs_pipeline), you should also be able to look at:

* Your coverage (`.bedgraph`) files for the above samples. (ALthough this isn't very important because IGV shows you coverage anyway.)  You can find them in [this folder](https://www.well.ox.ac.uk/~gav/projects/whg-training-resources/data/sequence_data_analysis/building_an_ngs_pipeline/results/coverage) if you don't have them already.

* Your `variants.vcf.gz` file containing the variant calls from Octopus. (If yours doesn't work, this may be due to an Octopus issue that has now been fixed. I filtered out the problem variants in [my
  version](https://www.well.ox.ac.uk/~gav/projects/whg-training-resources/data/sequence_data_analysis/building_an_ngs_pipeline/results/variants) which you can try instead.)

## Loading data

To load these files into IGV, choose `File -> Load from File...` from the menu. You should be prompted to download the appropriate reference; “Pfalciparum3D7” should already be available from the provided selection.  (If you're not prompted, make sure you are using the `Pfalciparum3D7 (v9.0)` genome. This should appear in the drop-down box at the top left of the window. If not, click on the dropdown and choose `...` and then select `P. falciparum 3D7 (V9.0)` from the list).

Load in the BAM files for `QG0033-C.bam` and `QG0041-C.bam` now, as well as the `variants.vcf.gz` file if you have it.  Once the data is loaded you're ready to go and [view the reads](./Exploring_reads_in_IGV.md).

