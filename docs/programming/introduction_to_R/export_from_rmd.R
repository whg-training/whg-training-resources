library(rmarkdown)
rmarkdown::render("R_introduction_to_Basic_Features.rmd",
    output_format=c("md_document", "html_document", "pdf_document"))
# Also need to copy the rmd into the static folder, along with images