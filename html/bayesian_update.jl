using Distributions ;
using Combinatorics ;
using Plots ;
using LogExpFunctions

x = 0.005:0.01:0.995

data = Dict(
	:a => 5,
	:b => 3
)

function binomial_ll( p, data )
	a = data[:a]
	b = data[:b]
	log(binomial( a + b, b )) + b*log(p) + a*log(1-p)
end


function grid_approximate(
	ll,
	data,
	grid
)
	values = ll.( grid, repeat( [data], length(grid) ))
	Dict(
		:log_integral => logsumexp(values),
		:values => values
	)
end

function log_posterior( ll, data, grid )
	approximation = grid_approximate( ll, data, grid )
	approximation[:values] .- approximation[:log_integral]
end

plot( x, exp.(binomial_ll.(x, repeat([data], length(x)) )))
plot( x, exp.( log_posterior( binomial_ll, data, x )))

# now implement intervals...