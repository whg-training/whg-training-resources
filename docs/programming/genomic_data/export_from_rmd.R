library(rmarkdown)
rmarkdown::render("Getting_started_with_genomic_data.rmd",
    output_format=c("md_document", "html_document", "pdf_document"))