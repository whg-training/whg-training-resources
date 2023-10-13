\name{gmsgff-package}
\alias{gmsgff-package}
\alias{gmsgff}
\docType{package}
\title{
\packageTitle{gmsgff}
}
\description{
\packageDescription{gmsgff}
}
\details{

The DESCRIPTION file:
\packageDESCRIPTION{gmsgff}
\packageIndices{gmsgff}
}
\author{
\packageAuthor{gmsgff}

Maintainer: \packageMaintainer{gmsgff}
}
\references{
}
\keyword{ package }
\seealso{
}
\examples{
gmsgff::parse_gff3_to_dataframe( "##gff-version 3
#description: test data
chr1\tme\tgene\t1\t1000\t.\t+\t.\tID=gene1;other_data=stuff
chr1\tme\texon\t10\t900\t.\t+\t.\tID=gene1.1;Parent=gene1
" )
}
