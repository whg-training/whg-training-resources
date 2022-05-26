# simple alignment example
# NB. I always set things up to be run from the top-level directory.
# snakefiles are mostly made of python code with snakemake-syntax rules put in.
samples = [ 'sample1', 'sample2' ]

# Instead of hard-coding a list of samples, you could instead pass in a config file.
# See align_with_config.snakefile for how to do this.

# This rule just tells snakemake what the main targets are:
rule all:
	input:
		[ "results/alignment_test/{sample}.sam".format( sample = sample ) for sample in samples ]

# This rule does the alignment
# The wildcard {sample} is recognised from the output file, and substituted in all the input files
rule align:
	input:
		read1 = 'data/test_data/{sample}_1.fq',
		read2 = 'data/test_data/{sample}_2.fq',
		reference = "reference/GRCh38/GRCh38DH/GRCh38_full_analysis_set_plus_decoy_hla.fa"
	output:
		sam = 'results/alignment_test/{sample}.sam'
	params:
		bwa = "/apps/well/bwa/0.7.12/bwa"
	shell: """
		{params.bwa} mem {input.reference} {input.read1} {input.read2} > {output.sam}
	"""

