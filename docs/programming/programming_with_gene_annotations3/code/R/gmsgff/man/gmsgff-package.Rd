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
~~ An overview of how to use the package, including the most important ~~
~~ functions ~~
}
\author{
\packageAuthor{gmsgff}

Maintainer: \packageMaintainer{gmsgff}
}
\references{
~~ Literature or other references for background information ~~
}
~~ Optionally other standard keywords, one per line, from file KEYWORDS in ~~
~~ the R documentation directory ~~
\keyword{ package }
\seealso{
~~ Optional links to other man pages, e.g. ~~
~~ \code{\link[<pkg>:<pkg>-package]{<pkg>}} ~~
}
\examples{
gmsgff::parse_gff3_to_dataframe( "##gff-version 3
#description: test data
chr1\tme\tgene\t1\t1000\t.\t+\t.\tID=gene1;other_data=stuff
chr1\tme\texon\t10\t900\t.\t+\t.\tID=gene1.1;Parent=gene1
" )
}
