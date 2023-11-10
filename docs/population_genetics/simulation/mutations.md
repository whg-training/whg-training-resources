---
sidebar_position: 2
---

# Adding mutations

So, genetic drift causes loss of haplotypes from the population and generates LD.
If this was all that was going on, we'd all be identical!

Of course in real populations there is an opposing force: **mutation**.  To see how this plays out let's add mutations to our model now.

## Starting over

Let's build our simulation again, and this time let's give ourselves a long stretch of chromosome to work over - say
5kb. As before we'll initialise the simulation with a set of 10 possible haplotypes:

```r
L = 5000
H = 10
haplotypes = matrix( NA, nrow = H, ncol = L )
haplotypes[,] = rbinom( n = H*L, size = 1, prob = 0.01 )
```

Now let's pick a population size and initialise the simulation - for a first go I will pick 250 samples over 1000
generations.

```r
N = 250 # number of individuals
G = 500 # number of generations
population = matrix(
  NA, nrow = G, ncol = N,
  dimnames = list(
    sprintf( "generation=%d", 1:G ),
    sprintf( "individual=%d", 1:N )
  )
)
```

And let's initialise our population:
```r
population[1,] = sample( 1:nrow(haplotypes), N, replace = TRUE )
```

As before we can plot the haplotypes in our population:
```r
plot.haplotypes( haplotypes[population[1,],] )
```


:::tip Note

You could also pick larger sample sizes above (especially if you have a fast computer!  This simulation is pretty slow.)
However, I'd advise not to go above around 500 though - 200 or 250 would be a good try.

:::

## Sorting haplotypes

Let's immediately make a couple of tweaks here. First, it would be nicer to sort the haplotypes before plotting.  Second, so we can easily compare different population sizes, let's just have it plot the first 100 samples.  Here is a function that can do that:
```r
plot.haplotypes <- function(
    haplotypes,
    sort = FALSE,
    number_to_plot = 100
) {
  # We just plot the 'sample' of the first n
  n = min(number_to_plot, nrow(haplotypes))
  haplotypes = haplotypes[1:n,]
  if( sort ) {
	# We use 'hierarchical clustering' to order the haplotypes
	# We are here using 'manhattan' distance, i.e. the sum of differences
	# between pairs of haplotypes
    order = hclust(
		dist( haplotypes, method = "manhattan" )
	)$order
  } else {
    order = 1:nrow(haplotypes)
  }
  image(
    t(haplotypes[order,]),
    x = 1:ncol(haplotypes),
    y = 1:nrow(haplotypes),
    xlab = "variant",
    ylab = "haplotype"
  )
}

plot.haplotypes( haplotypes[population[1,],], sort = TRUE )
```

Ok this looks nice!

## Implementing mutations

Our `evolve()` function is pretty simple at the moment - it looks like this:

```r
evolve <- function( currentGeneration ) {
  parents = sample( 1:N, size = N, replace = TRUE )
  return( currentGeneration[parents] )
}
```

Let's update it to account for mutations.  

This takes a bit of care because of the way we have set our simulation up -  using the  `haplotypes` matrix to keep track of the actual alleles on each haplotype.  To do this, let's create a `mutate()` function which:

1. reads in the index of a current haplotype
2. mutates it at a single site, and
3. adds the new mutant haplotype to the list of haplotypes:

```r
mutate <- function( which_haplotype ) {
  # Take an existing haplotype...
  old_haplotype = haplotypes[which_haplotype,]

  # mutate it at a single site
  new_haplotype = old_haplotype
  w = sample( 1:L, 1 )
  new_haplotype[w] = 2

  # Add it to our list and return the index.
  haplotypes <<- rbind( haplotypes, new_haplotype )
  return( nrow( haplotypes ))
}
```

:::caution Note

The syntax `<<-` is important here!  We are using this to alter the global `haplotypes` variable.  In general, using a global variable like this is **bad programming practice**, but it will work for our simulation so we're going with for the moment...

:::

:::tip Note

Most entries of the haplotypes are 0 or 1, but in `mutate()` I chose to mutate to a value of 2!  The reason for this is that these new mutations will appear a different colour on our output plots, so we can easily see the effect of mutations on the population

:::
If you call `mutate()`, say like this: `mutate(5)`, you ought now to find that:

* `haplotypes` now has an extra row (row 11 presumably).
* the new row is the same as row 5, except for one mutation in it.`


With mutations in place we can write an updated `evolve()` function.  We will take in a **mutation rate** parameter and, after each inheritance takes place, randomly decide whether a mutation occurs.

```r

evolve <- function(
	currentGeneration,
	mutation_rate_per_locus = 0.1
) {
  # Inherit from parents, as before
  parents = sample( 1:N, size = N, replace = TRUE )
  new = currentGeneration[parents]

  # Now decide if any haplotypes should mutate...
  who.mutates = which( rbinom( N, size = 1, prob = mutation_rate_per_locus ) == 1 )
  # ...and mutate them:
  for( i in who.mutates ) {
    new[i] = mutate( new[i] )
  }

  return( new )
}
```


:::tip Note
When talking about mutation rates, you have to decide if you are talking about mutation **per locus** (i.e. over the whole 5kb) or **per site**.  The function above is using the **mutation rate per locus** (so the rate per site is 1/5,000 times this.)
:::

## Watching it run

R is not great at making animated plots - instead let's aim to store the images on the filesystem.  We'll make a new folder for this now.

First make sure you are in the folder you want to be in for this practical, and let's make a place to store output images.  I'll keep the population size in the filename:

```r
mutation_rate = 0.1
image_dir = sprintf( "simulation/N=%d,L=%d,mu=%.3f", N, L, mutation_rate )
dir.create( image_dir, recursive = TRUE,  showWarnings = FALSE )
dir.create( sprintf( "%s/haplotypes", image_dir), recursive = TRUE,  showWarnings = FALSE )
```

Here is the useful `echo()` function to print messages:
```r
echo = function( message, ... ) {
  cat( sprintf( message, ... ))
}
```

And let's iterate:
```r
for( generation in 2:G ) {
  cat( sprintf( "generation %d of %d...\n", generation, G ))

  # Evolve the population, now with mutations
  population[generation,] = evolve( population[generation-1,], mutation_rate )

  # Let's just plot every 5th generation
  if( generation %% 5 == 1 ) {
    filename = sprintf( "%s/haplotypes/generation_%04d.png", image_dir, generation )
    echo( "Plotting generation %d to \"%s\"...\n", generation, filename )
    png( file = filename, width = 1000, height = 400 )
    plot.haplotypes( haplotypes[population[generation,],], sort = TRUE )
    dev.off()
  
    # !! IMPORTANT!! Use gc() to return memory to operating system!
	# Without this you may use up all your RAM
    gc()
  }
}
```

:::tip Note

This will take a while to run.

While it's going, point your operating system's image viewer at the output directory (`image_dir`) above to have a look at what's happening.  You should see your population evolving in real time!  Can you see the new mutations?

:::

## Assessing diversity



Let's also implement two ways of measuring the amount of genetic diversity.  These are:

* The **average number of mutational differences between pairs of haplotypes**, also known as the nucleotide diversity.  In popgen literature this is often denoted by $\pi$.

* The **average heterozygosity** of the population, i.e. how likely are two randomly drawn alleles to be different?

Here are two functions to compute these quantities:

```r
compute.mean_number_of_pairwise_differences = function(
	population,
	haplotypes = haplotypes
) {
	generation = haplotypes[population,]
	N = nrow(generation)
	total = 0
	for( i in 1:(N-1) ) {
		for( j in (i+1):N ) {
			a = generation[i,]
			b = generation[j,]
			total = total + sum( a != b )
		}
	}
	return( total / (N*(N-1)/2))
}
```

```r
compute.heterozygosity = function(
	population
) {
	A = table(population)
	n = sum(A)
	result = 1
	for( i in 1:length(A)) {
		result = result - (A[i]/n) * ((A[i]-1)/(n-1))
	}
	return( result ) 
}
```

Let's plot these for our simulation now.  We'll use the `layout()` function to make a two-row plot:
```r
pi = sapply(
  1:G,
  function(i) {
    compute.mean_number_of_pairwise_differences( population[i,] )
  }
)

heterozygosity = sapply(
  1:G,
  function(i) {
    compute.heterozygosity( population[i,] )
  }
)


layout( matrix( 1:2, ncol = 1 ))
plot(
	1:G,
	pi,
	xlab = "Generation",
	ylab = "Nucleotide diversity",
	bty = 'n',
	type = 'l',
	lwd = 2
)
abline( h = 2 * N * mutation_rate, lty = 2, col = 'red' )
grid()
plot(
	1:G,
	heterozygosity,
	xlab = "Generation",
	ylab = "Heterozygosity",
	bty = 'n',
	type = 'l',
	lwd = 2
)
abline( h = (2 * N * mutation_rate) / (2*N*mutation_rate + 1), lty = 2, col = 'red' )
grid()
```

