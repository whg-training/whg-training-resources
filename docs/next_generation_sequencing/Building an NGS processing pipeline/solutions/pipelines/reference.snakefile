rule index_reference_sequence:
    input:
        sequence = "data/reference/{reference}.fa.gz"
    output:
        bwt = "data/reference/{reference}.fa.gz.bwt"
    shell: """
        bwa index {input.reference}
    """
