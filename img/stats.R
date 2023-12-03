x = seq( from = 0, to = 1, by = 0.01 )
png( file = "/tmp/x.png", width = 300, height = 200 )plot(x,dbeta(x,shape1=5,shape2=2),type='l', xaxt = 'n', yaxt = 'n', bty = 'n', lwd = 2);
par( mar = rep( 0.5, 4 ))
plot(x,dbeta(x,shape1=5,shape2=2),type='l', xaxt = 'n', yaxt = 'n', bty = 'n', lwd = 2);
points(x,dbeta(x,shape1=4,shape2=2),type='l', xaxt = 'n', yaxt = 'n', bty = 'n', lwd = 1);
points(x,dbeta(x,shape1=3,shape2=2),type='l', xaxt = 'n', yaxt = 'n', bty = 'n', lwd = 0.5);
points(x,dbeta(x,shape1=2,shape2=2),type='l', xaxt = 'n', yaxt = 'n', bty = 'n', lwd = 0.25);
grid()
