import gff, io, pandas
import unittest

class TestGff(unittest.TestCase):
	test_data = '\n'.join([  # join lines with newline character
		'##gff-version 3',
		'#description: test data',
		'chr1\tme\tgene\t1\t1000\t.\t+\t.\tID=gene1;other_data=stuff',
		'chr1\tme\texon\t10\t900\t.\t+\t.\tID=gene1.1;Parent=gene1'
	])
	
	def test_parse_gff3_to_dataframe( self ): 
		from io import StringIO
		data = gff.parse_gff3_to_dataframe( StringIO( self.test_data ))
		assert data['seqid'][0] == 'chr1'
		assert data['strand'][0] == '+'
		assert data['attributes'][0] == 'ID=gene1;other_data=stuff'
		assert data['seqid'][1] == 'chr1'
		assert data['strand'][1] == '+'
		assert data['attributes'][1] == 'ID=gene1.1;Parent=gene1'
		assert data['start'][0] == 1
		assert data['end'][0] == 1000
		assert data['start'][1] == 10
		assert data['end'][1] == 900
		from math import isnan
		assert isnan( data['score'][1] ) 
		assert data['ID'][0] == 'gene1'
		assert data['ID'][1] == 'gene1.1'

	def test_extract_value_from_attributes( self ):
		assert gff.extract_value_from_attributes( "a=b;ID=test_value", "ID" ) == "test_value"
		assert gff.extract_value_from_attributes( "a=b;ID=test_value", "Parent" ) == None
		assert gff.extract_value_from_attributes( "ID=1;Parent=2", "ID" ) == "1"
		assert gff.extract_value_from_attributes( "ID=1;Parent=2", "Parent" ) == "2"
		assert gff.extract_value_from_attributes(
		  "ID=ENST00000456328.2;Parent=ENSG00000223972.5;gene_type=transcribed_unprocessed_pseudogene",
		  "ID"
		) == "ENST00000456328.2"
		assert gff.extract_value_from_attributes(
		  "ID=ENST00000456328.2;Parent=ENSG00000223972.5;gene_type=transcribed_unprocessed_pseudogene",
		  "gene_type"
		) == "transcribed_unprocessed_pseudogene"

# Make sure to run the tests.
unittest.main()
