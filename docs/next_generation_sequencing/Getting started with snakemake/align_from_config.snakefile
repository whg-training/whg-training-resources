# simple alignment example using a config file
# NB. I always set things up to be run from the top-level directory.
#
# This version loads config from the config file passed to --configfile argument
# This makes things flexible in terms of expanding the pipeline.
# A simpler hard-coded version can be found in align.snakefile.
reads = config[ 'reads']

# This rule just tells snakemake what the main targets are:
rule all:
	input:
		[
			"results/alignment_test/{assembly}/{sample}_{assembly}.sam".format( sample = sample, assembly = assembly )
			for sample in reads.keys() for assembly in config['assemblies'].keys()
		]

# This rule does the alignment
# The wildcard {name} is recognised from the output file, and substituted in all the input files
# the input files here are written as python lambda functions.  They get the wildcards object passed
# in, so w.name is the wildcard inferred from output files.
rule align:
	input:
		read1 = lambda w: reads[w.sample].format( read = "1" ),
		read2 = lambda w: reads[w.sample].format( read = "2" ),
		assembly = lambda w: config["assemblies"][w.assembly]
	output:
		sam = 'results/alignment_test/{assembly}/{sample}_{assembly}.sam'
	params:
		bwa = "/apps/well/bwa/0.7.12/bwa"
	shell: """
		{params.bwa} mem {input.assembly} {input.read1} {input.read2} > {output.sam}
	"""

