w = which(
  samples$country %in% c( "Gambia", "Ghana", "Cameroon", "Tanzania", "Kenya" )
  & (samples$in_CP1_phased_data == 1)
  & samples$exclude_quality == 0
)
as = samples[w,]
table( as$country )

D = bgen.load(
  "malariagen/bgen/MalariaGEN-MassArray_b37.bgen",
  rsids = c( "rs8176719", "rs4951377", "rs334", "rs186873296", "rs60822373" ),
  samples = as$sample_id
)
stopifnot( length( colnames( D$data )) == nrow( as ))
stopifnot( length( which( as$sample_id != colnames( D$data ))) == 0 )

D$dosage = D$data[,,2] + 2 * D$data[,,3]

as$ethnicity

levels( as$ethnicity ) = sprintf( "ethnicity_%d", 1:length( levels( as$ethnicity )))

make_random_strings <- function(n = 5000) {
  a <- do.call(paste0, replicate(5, sample(LETTERS, n, TRUE), FALSE))
  paste0(a, sprintf("%04d", sample(9999, n, TRUE)), sample(LETTERS, n, TRUE))
}

as = cbind( as, t( D$dosage ))
