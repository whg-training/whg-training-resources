---
sidebar_position: 2
---

# List contents of an FTP site

The tool `lftp` can be used to quickly list contents of an FTP site. [lftp](https://lftp.yar.ru) calls itself a 'sophisticated file
transfer program' and it is! On most platforms, `lftp` can be installed from the `conda-forge` conda channel:

```
mamba install -c conda-forge lftp
```

For example: here is how to list all FASTA files on the [ensembl ftp site](http://ftp.ensembl.org/pub/):

```sh
lftp -c 'open ftp://ftp.ensembl.org/pub/current_fasta; find'
```

You can then redirect the output into a file.

## Example

For example here is some BASH code to download all the chromosome-level
[GFF files](/bioinformatics/exploring_gene_annotations_in_bash/) from the Ensembl FTP site:

```sh
echo "Getting file list..."
lftp -c 'open ftp://ftp.ensembl.org/pub/current_gff3; find' > all_files.txt
grep '.chr.gff3.gz' all_files.txt > gff3_files.txt
echo "Ok, `cat gff3_files.txt | wc -l` files to download..."
for f in `cat gff3_files.txt`; do
  echo "Downloading ${f}..."
  curl -O ftp://ftp.ensembl.org/pub/current_gff3/${f}
done
```

**Warning.** This will take a while and at the time of writing uses up about 2Gb of disk space!

## Alternatives

An alternative is to use [ncftp](https://www.ncftp.com). Specifically `ncftpls -R` will recursively list contents of an FTP
site.  (However I find it less useful as it prints out directory names and filename seperately).
