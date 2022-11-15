compute.heterozygosity <- function( population ) {
	# Let's use a stupid method to do this: 
	# add it up for all pairs of samples
	N = length(population)
	count = 0
	number_of_pairs = (N*(N-1)/2) # N choose 2
	for( i in 1:(N-1)) {
		for( j in (i+1):N ) {
			if( population[i] != population[j] ) {
				count = count + 1
			}
		}
	}
	return ( count / number_of_pairs )
}


compute.number.of.pairwise.differences <- function( population, haplotypes ) {
	N = length( population )
	H = length( haplotypes )
	# Let's use a stupid method to do this.
	number_of_pairs = (N*(N-1)/2) # N choose 2
	differences = 0
	for( i in 1:(N-1)) {
		hi = haplotypes[population[i],]
		for( j in (i+1):N ) {
			hj = haplotypes[population[j],]
			differences = differences + sum( abs(hi-hj) )
		}
	}
	return( differences / number_of_pairs )
}


plot.simulation <- function(
	sim,
	G = NULL # specify generation to plot up to - if NULL, use final generation
) {
  layout(
    matrix(
      c( 1, 1,
         2, 4,
         3, 5,
         6, 7
      ),
      byrow = T,
      nrow = 4
    ),
    heights = c( 1/5, 2/5, 2/5, 2/5 )
  )
  par( mar = c( 1, 3, 1, 1 ))

  if( is.null(G) ) {
      G = sim$G
  }

  # First let's write a legend
  blank.plot()
  legend(
    "left",
    legend = c(
      sprintf( "number of variants (L) = %d", sim$L ),
      sprintf( "number of haplotypes (H) = %d", sim$H ),
      sprintf( "number of individuals (N) = %d", sim$N ),
      sprintf( "number of generations (G) = %d", sim$G ),
      sprintf( "plotting to generation %d", G )
    ),
    bty = 'n',
    xpd = NA,
    ncol = 1
  )

  heterozygosity = compute.heterozygosity( sim$population[G,] )
  pairwise.differences = compute.number.of.pairwise.differences( sim$population[G,], sim$haplotypes )

  legend(
    "right",
    legend = c(
      sprintf( "At generation %d:", G ),
      sprintf( "Heterozygosity = %.5f", heterozygosity ),
      sprintf( "Number of pairwise differences = %.5f", pairwise.differences )
    ),
    bty = 'n',
    xpd = NA,
    ncol = 1
  )

  par( mar = c( 3, 3, 3, 1 ))
  # Plot starting and ending haplotypes
  plot.haplotypes( sim$haplotypes[sim$population[1,],] )
  mtext( "Variants", 1, line = 2, cex = 0.5 )
  mtext( "Haplotypes", 2, line = 2, cex = 0.5 )
  mtext(
    sprintf(
      "1st generation (%d segregating haplotypes)",
      length( unique( sim$population[1,] ))
    ),
    3,
    line = 1
  )
  plot.haplotypes( sim$haplotypes[sim$population[G,],] )
  mtext( "Variants", 1, line = 2, cex = 0.5 )
  mtext( "Haplotypes", 2, line = 2, cex = 0.5 )
  mtext(
    sprintf(
      "Generation %d (%d segregating haplotypes)",
      G,
      length( unique( sim$population[G,] ))
    ),
    3,
    line = 1
  )

  # Frequencies
  haplotype.frequencies = compute.haplotype.frequencies( sim )
  variant.frequencies = compute.variant.frequencies( sim )

  palette = rainbow( sim$H )
  blank.plot( xlim = c( 1, sim$G ), ylim = c( 0, 1 ) )
  for( i in 1:sim$H ) {
    points( 1:G, haplotype.frequencies[1:G,i], col = palette[i], type = 'l' )
  }
  axis( 1 )
  axis( 2 )
  mtext( "Haplotype frequencies", 2, line = 2, cex = 0.5 )
  mtext( "Generations", 1, line = 2, cex = 0.5 )
  mtext( "Haplotype frequency evolution", 3, line = 1 )
  
  grid()

  palette = rainbow( sim$L )
  blank.plot( xlim = c( 1, sim$G ), ylim = c( 0, 1 ), ylab = "Variant frequencies")
  for( i in 1:sim$L ) {
    points( 1:G, variant.frequencies[1:G,i], col = palette[i], type = 'l' )
  }
  axis( 2 )
  axis( 1 )
  mtext( "Variant frequencies", 2, line = 2, cex = 0.5 )
  mtext( "Generations", 1, line = 2, cex = 0.5 )
  mtext( "Variant frequency evolution", 3, line = 1 )
  grid()

  # LD matrices
  breaks = c( -0.01, seq( from = 0.1, to = 1, by = 0.1 ))
  ld.colours = c( 'grey95', rev( heat.colors( length(breaks)-2 )))

  starting.ld = compute.ld( sim$haplotypes[sim$population[1,],] )^2
  ending.ld = compute.ld( sim$haplotypes[sim$population[G,],] )^2
  image( t( starting.ld ), breaks = breaks, col = ld.colours, x = 1:sim$L, y = 1:sim$L )
  mtext( "LD (r2) at starting generation", 3, line = 1 )
  image( t( ending.ld ), breaks = breaks, col = ld.colours, x = 1:sim$L, y = 1:sim$L )
  mtext( sprintf( "LD (r2) at generation %d", G ), 3, line = 1 )
  
  legend(
    "topleft",
    col = ld.colours[c(2,4,6,8,10)],
    legend = sprintf( "<=%.2f", breaks[c(3,5,7,9,11)]),
    pch = 15,
    bty = 'n'
  )
}
