library(rmarkdown)
rmarkdown::render("R-introduction-to-Basic-Features.rmd",
    output_format=c("md_document", "html_document", "pdf_document"))