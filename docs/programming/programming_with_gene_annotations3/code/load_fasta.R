echo = function( message, ... ) {
	cat( sprintf( message, ... ))
}

load_fasta_to_list <- function( filename ) {
	require(tidyverse)
	echo( "++load_fasta_to_list: loading FASTA file from \"%s\"...\n", filename )
	data = scan(
		gzfile(filename),
		what = "character"
	)
	echo( "++load_fasta_to_list: finding contigs...\n" )
	contig_starts = grep( "^>", data )
	# Compute the contig names by stripping out '>':
	contig_names = gsub(
		'^>', '',
		data[contig_starts]
	)
	echo( "++load_fasta_to_list: ok, %d sequences found.\n", length(contig_names))
	echo( "++load_fasta_to_list: finding sequences...\n" )
	# For each contig, find the range of sequence lines corresponding
	# to that contig
	sequence_line_ranges = map(
		1:length(contig_starts),
		function(i) {
			c(
				contig_starts[i]+1,
				c(contig_starts,length(data))[i+1]-1 )
		}
	)
	echo( "++load_fasta_to_list: ok, concatenating sequence...\n" )
	# Now use `paste()` to stick together the sequences for each contig
	fasta = map(
		sequence_line_ranges,
		function(range) {
			paste( data[range[1]:range[2]], collapse = "" )
		}
	)
	# Make sure to give our list the right names...
	names(fasta) = contig_names
	# ...and return it.
	echo( "++load_fasta_to_list: success!\n" )
	return( fasta )
}

compute_base_counts = function( sequence ) {
	L = nchar(sequence)
	c(
		A = L - nchar(gsub( "[Aa]", "", sequence )),
		C = L - nchar(gsub( "[Cc]", "", sequence )),
		G = L - nchar(gsub( "[Gg]", "", sequence )),
		T = L - nchar(gsub( "[Tt]", "", sequence )),
		N = L - nchar(gsub( "[Nn]", "", sequence ))
	)
}
