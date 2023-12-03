"use strict";(self.webpackChunkwhg_training_resources=self.webpackChunkwhg_training_resources||[]).push([[3524],{3905:(e,a,t)=>{t.d(a,{Zo:()=>m,kt:()=>N});var n=t(7294);function s(e,a,t){return a in e?Object.defineProperty(e,a,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[a]=t,e}function r(e,a){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);a&&(n=n.filter((function(a){return Object.getOwnPropertyDescriptor(e,a).enumerable}))),t.push.apply(t,n)}return t}function p(e){for(var a=1;a<arguments.length;a++){var t=null!=arguments[a]?arguments[a]:{};a%2?r(Object(t),!0).forEach((function(a){s(e,a,t[a])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):r(Object(t)).forEach((function(a){Object.defineProperty(e,a,Object.getOwnPropertyDescriptor(t,a))}))}return e}function i(e,a){if(null==e)return{};var t,n,s=function(e,a){if(null==e)return{};var t,n,s={},r=Object.keys(e);for(n=0;n<r.length;n++)t=r[n],a.indexOf(t)>=0||(s[t]=e[t]);return s}(e,a);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(n=0;n<r.length;n++)t=r[n],a.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(s[t]=e[t])}return s}var o=n.createContext({}),l=function(e){var a=n.useContext(o),t=a;return e&&(t="function"==typeof e?e(a):p(p({},a),e)),t},m=function(e){var a=l(e.components);return n.createElement(o.Provider,{value:a},e.children)},c="mdxType",h={inlineCode:"code",wrapper:function(e){var a=e.children;return n.createElement(n.Fragment,{},a)}},d=n.forwardRef((function(e,a){var t=e.components,s=e.mdxType,r=e.originalType,o=e.parentName,m=i(e,["components","mdxType","originalType","parentName"]),c=l(t),d=s,N=c["".concat(o,".").concat(d)]||c[d]||h[d]||r;return t?n.createElement(N,p(p({ref:a},m),{},{components:t})):n.createElement(N,p({ref:a},m))}));function N(e,a){var t=arguments,s=a&&a.mdxType;if("string"==typeof e||s){var r=t.length,p=new Array(r);p[0]=d;var i={};for(var o in a)hasOwnProperty.call(a,o)&&(i[o]=a[o]);i.originalType=e,i[c]="string"==typeof e?e:s,p[1]=i;for(var l=2;l<r;l++)p[l]=t[l];return n.createElement.apply(null,p)}return n.createElement.apply(null,t)}d.displayName="MDXCreateElement"},6748:(e,a,t)=>{t.r(a),t.d(a,{assets:()=>o,contentTitle:()=>p,default:()=>h,frontMatter:()=>r,metadata:()=>i,toc:()=>l});var n=t(7462),s=(t(7294),t(3905));const r={sidebar_position:.5},p="Visualising haplotypes in R",i={unversionedId:"population_genetics/plotting_haplotypes/README",id:"population_genetics/plotting_haplotypes/README",title:"Visualising haplotypes in R",description:"In this page you will load up some real haplotype data (from the 1000 Genomes Project) and plot it in R.",source:"@site/docs/population_genetics/plotting_haplotypes/README.md",sourceDirName:"population_genetics/plotting_haplotypes",slug:"/population_genetics/plotting_haplotypes/",permalink:"/whg-training-resources/population_genetics/plotting_haplotypes/",draft:!1,editUrl:"https://github.com/whg-training/whg-training-resources/edit/main/docs/population_genetics/plotting_haplotypes/README.md",tags:[],version:"current",sidebarPosition:.5,frontMatter:{sidebar_position:.5},sidebar:"sidebar7",previous:{title:"Population genetics",permalink:"/whg-training-resources/population_genetics/"},next:{title:"tbc",permalink:"/whg-training-resources/population_genetics/plotting_haplotypes/tbc"}},o={},l=[{value:"Ordering the haplotype",id:"ordering-the-haplotype",level:2},{value:"Computing diversity",id:"computing-diversity",level:2},{value:"Challenge questions",id:"challenge-questions",level:2}],m={toc:l},c="wrapper";function h(e){let{components:a,...r}=e;return(0,s.kt)(c,(0,n.Z)({},m,r,{components:a,mdxType:"MDXLayout"}),(0,s.kt)("h1",{id:"visualising-haplotypes-in-r"},"Visualising haplotypes in R"),(0,s.kt)("p",null,"In this page you will load up some real haplotype data (from the 1000 Genomes Project) and plot it in R."),(0,s.kt)("p",null,"Start by downloading the file ",(0,s.kt)("inlineCode",{parentName:"p"},"GWD_30x_calls.filtered.tsv.gz")," from ",(0,s.kt)("a",{parentName:"p",href:"https://www.well.ox.ac.uk/bioinformatics/training/gms/data/"},"this folder")," and loading into R:"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-r"},'library( tidyverse )\ngwd = read_tsv( "https://www.well.ox.ac.uk/bioinformatics/training/gms/data/GWD_30x_calls.filtered.tsv.gz" )\n\nprint(gwd)\n')),(0,s.kt)("p",null,"Have a look at the data.  The data consists of genotype calls for 112 'Gambian from the Western Division' individuals\nfrom the recent high-coverage sequencing of ",(0,s.kt)("a",{parentName:"p",href:"https://www.internationalgenome.org"},"1000 Genomes Project")," samples."),(0,s.kt)("p",null,"It has data for >30,000 biallelic SNPs (in rows) and the samples in columns."),(0,s.kt)("div",{className:"admonition admonition-tip alert alert--success"},(0,s.kt)("div",{parentName:"div",className:"admonition-heading"},(0,s.kt)("h5",{parentName:"div"},(0,s.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,s.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,s.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"Note")),(0,s.kt)("div",{parentName:"div",className:"admonition-content"},(0,s.kt)("p",{parentName:"div"},"If you want to see how this data was generated - follow the ",(0,s.kt)("a",{parentName:"p",href:"/whg-training-resources/sequence_data_analysis/variant_calling_and_imputation/"},"Variant calling and imputation practical"),"."),(0,s.kt)("p",{parentName:"div"},"This data comes from the region of the gene ",(0,s.kt)("em",{parentName:"p"},"FUT2"),"."))),(0,s.kt)("p",null,"##\xa0Plotting the haplotypes"),(0,s.kt)("p",null,"Let's plot this data now.  To start, let's turn the genotypes themselves into a matrix:"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-r"},"GT = as.matrix( gwd[,5:ncol(gwd)])\n")),(0,s.kt)("p",null,"A simple way to plot is to use ",(0,s.kt)("inlineCode",{parentName:"p"},"image()"),".  First we'll throw out monomorphic and rare variants:"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-r"},"frequencies = rowSums(GT) / ncol(GT)\nw = which( frequencies > 0 & frequencies < 1 )\nGT = GT[w,]\nmetadata = gwd[w,1:4]\n")),(0,s.kt)("p",null,"Let's first get the number of SNPs and haplotypes in the data:"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-r"},"L = nrow(GT) # number of SNPs\nN = ncol(GT) # number of haplotypes\n")),(0,s.kt)("p",null,"and plot:"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-r"},'image(\n    GT,\n    x = 1:L,\n    y = 1:N,\n    xlab = "SNPs",\n    ylab = "Chromosomes"\n)\n')),(0,s.kt)("p",null,"Cool!  But a bit noisy."),(0,s.kt)("h2",{id:"ordering-the-haplotype"},"Ordering the haplotype"),(0,s.kt)("p",null,"Let's use a simple approach to order the haplotypes in the region - ",(0,s.kt)("a",{parentName:"p",href:"https://en.wikipedia.org/wiki/Hierarchical_clustering"},"hierarchical\nclustering"),"."),(0,s.kt)("p",null,"In R we can do this by first constructing a ",(0,s.kt)("strong",{parentName:"p"},"distance matrix")," and then using ",(0,s.kt)("inlineCode",{parentName:"p"},"hclust()")," to cluster it.  Let's try now:"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-r"},'distance = dist(\n    t(GT),\n    method = "manhattan"\n)\n')),(0,s.kt)("p",null,(0,s.kt)("img",{alt:"img",src:t(3971).Z,width:"2348",height:"866"})),(0,s.kt)("p",null,"Here we've used 'manhattan' distance, that is, the distance between two haplotypes is the number of mutational\ndifferences between them."),(0,s.kt)("div",{className:"admonition admonition-tip alert alert--success"},(0,s.kt)("div",{parentName:"div",className:"admonition-heading"},(0,s.kt)("h5",{parentName:"div"},(0,s.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,s.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,s.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"Note")),(0,s.kt)("div",{parentName:"div",className:"admonition-content"},(0,s.kt)("p",{parentName:"div"},"The ",(0,s.kt)("inlineCode",{parentName:"p"},"t()")," part is needed around GT, otherwise we will be clustering SNPs instead of samples.  (You'll know if you got\nthis wrong because the output will be enormous below."))),(0,s.kt)("p",null,"You can see what the distance matrix looks like by converting to a matrix:"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-r"},"as.matrix(distance)[1:10,1:10]\n")),(0,s.kt)("p",null,"You ushould see something like this:"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre"},"             HG02461_hap1 HG02461_hap2 HG02462_hap1 HG02462_hap2 HG02464_hap1 HG02464_hap2 HG02465_hap1 HG02465_hap2\nHG02461_hap1      0.00000     36.87818     43.52011     42.80187     42.13075     38.28838     44.46347     40.59557\nHG02461_hap2     36.87818      0.00000     45.40925     39.26831     41.86884     38.26225     41.58125     44.40721\nHG02462_hap1     43.52011     45.40925      0.00000     40.84116     39.98750     43.42810     40.18706     43.33590\nHG02462_hap2     42.80187     39.26831     40.84116      0.00000     44.75489     44.22669     42.24926     41.73727\nHG02464_hap1     42.13075     41.86884     39.98750     44.75489      0.00000     43.39355     43.31282     42.32021\nHG02464_hap2     38.28838     38.26225     43.42810     44.22669     43.39355      0.00000     43.53160     42.28475\nHG02465_hap1     44.46347     41.58125     40.18706     42.24926     43.31282     43.53160      0.00000     46.22770\nHG02465_hap2     40.59557     44.40721     43.33590     41.73727     42.32021     42.28475     46.22770      0.00000\nHG02561_hap1     42.39104     42.01190     41.67733     41.43670     44.11349     40.97560     42.87190     41.53312\nHG02561_hap2     46.04346     43.33590     43.26662     44.85532     45.33211     40.69398     42.95346     46.10857\n")),(0,s.kt)("p",null,"Now let's cluster and order them using ",(0,s.kt)("inlineCode",{parentName:"p"},"hclust()"),":"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-r"},"the_order = hclust( distance )$order\n")),(0,s.kt)("p",null,"Let's plot again - this time ordering the columns (haplotypes) in the data:"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-r"},'image(\n    GT[,the_order],\n    x = 1:L,\n    y = 1:N,\n    xlab = "SNPs",\n    ylab = "Chromosomes"\n)\n')),(0,s.kt)("h2",{id:"computing-diversity"},"Computing diversity"),(0,s.kt)("p",null,"How much variation is there?  Here are a few ways to look at it."),(0,s.kt)("p",null,"First we could look at the frequencies of all the variants in the data:"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-r"},'frequencies = rowSums( GT ) / ncol( GT )\nhist(\n    frequencies,\n    breaks = 25,\n    xlab = "Alt allele frequency",\n    ylab = "Count",\n    main = "Site frequency spectrum"\n)\n')),(0,s.kt)("p",null,(0,s.kt)("img",{alt:"img",src:t(6482).Z,width:"1444",height:"1074"})),(0,s.kt)("p",null,"This picture is pretty typical - most variant alleles are pretty rare, and a few are common."),(0,s.kt)("div",{className:"admonition admonition-tip alert alert--success"},(0,s.kt)("div",{parentName:"div",className:"admonition-heading"},(0,s.kt)("h5",{parentName:"div"},(0,s.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,s.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,s.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"Note")),(0,s.kt)("div",{parentName:"div",className:"admonition-content"},(0,s.kt)("p",{parentName:"div"},"These are the frequencies at ",(0,s.kt)("strong",{parentName:"p"},"variable sites")," only.  If we computed at every site, there would be an even bigger spike\nat zero - counting all the sites that are not variable between people in our data. (How many of these are there in this\nregion?)"))),(0,s.kt)("p",null,"This picture is for ",(0,s.kt)("em",{parentName:"p"},"alternate")," alleles (versus reference alleles).  A better plot would show the frequencies of\n",(0,s.kt)("strong",{parentName:"p"},"derived")," alleles (i.e. those that have arisen trhough mutation compared to the common ancestor).  To do that, we\nwould need an ancestral allele, which we don't have right now.  So instead let's plot hte ",(0,s.kt)("strong",{parentName:"p"},"folder site frequency spectrum"),":"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-r"},'hist(\n    pmin( frequencies, 1 - frequencies ),\n    breaks = 25,\n    xlab = "Minor allele frequency",\n    ylab = "Count",\n    main = "Folded site frequency spectrum"\n)\n\n')),(0,s.kt)("p",null,(0,s.kt)("img",{alt:"img",src:t(7976).Z,width:"1478",height:"1128"})),(0,s.kt)("p",null,"Another natural metric is to compute evolutionary distances between haplotypes by ",(0,s.kt)("strong",{parentName:"p"},"counting mutations"),"."),(0,s.kt)("p",null,"The idea is that (ignoring recombination for a moment) - mutations that seperate two samples represent those that have\noccurred since their most recent common ancestor.  Roughtly speaking the number of mutations 'counts' the evolutionary\ndistance between the haplotypes.  A natural metric is thus ",(0,s.kt)("strong",{parentName:"p"},"number of pairwise differences")," between the\ntwo haplotypes."),(0,s.kt)("p",null,"Let's see how distantly related the haplotypes are on average, by computing the  ",(0,s.kt)("strong",{parentName:"p"},"average number of pairwise\ndifferences")," between different haplotypes - also known as ",(0,s.kt)("strong",{parentName:"p"},"nucleotide diversity")," - now. To do this we'll write a\nfunction which loops over all pairs of haplotypes in the data."),(0,s.kt)("div",{className:"admonition admonition-tip alert alert--success"},(0,s.kt)("div",{parentName:"div",className:"admonition-heading"},(0,s.kt)("h5",{parentName:"div"},(0,s.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,s.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,s.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"Note")),(0,s.kt)("div",{parentName:"div",className:"admonition-content"},(0,s.kt)("p",{parentName:"div"},"How many pairs of distinct haplotypes are there?  The answer is of course the number of ways of drawing two things from ",(0,s.kt)("span",{parentName:"p",className:"math math-inline"},(0,s.kt)("span",{parentName:"span",className:"katex"},(0,s.kt)("span",{parentName:"span",className:"katex-mathml"},(0,s.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,s.kt)("semantics",{parentName:"math"},(0,s.kt)("mrow",{parentName:"semantics"},(0,s.kt)("mi",{parentName:"mrow"},"N")),(0,s.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"N")))),(0,s.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,s.kt)("span",{parentName:"span",className:"base"},(0,s.kt)("span",{parentName:"span",className:"strut",style:{height:"0.6833em"}}),(0,s.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.10903em"}},"N")))))," things - known as '",(0,s.kt)("span",{parentName:"p",className:"math math-inline"},(0,s.kt)("span",{parentName:"span",className:"katex"},(0,s.kt)("span",{parentName:"span",className:"katex-mathml"},(0,s.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,s.kt)("semantics",{parentName:"math"},(0,s.kt)("mrow",{parentName:"semantics"},(0,s.kt)("mi",{parentName:"mrow"},"N")),(0,s.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"N")))),(0,s.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,s.kt)("span",{parentName:"span",className:"base"},(0,s.kt)("span",{parentName:"span",className:"strut",style:{height:"0.6833em"}}),(0,s.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.10903em"}},"N")))))," choose 2':"),(0,s.kt)("div",{parentName:"div",className:"math math-display"},(0,s.kt)("span",{parentName:"div",className:"katex-display"},(0,s.kt)("span",{parentName:"span",className:"katex"},(0,s.kt)("span",{parentName:"span",className:"katex-mathml"},(0,s.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML",display:"block"},(0,s.kt)("semantics",{parentName:"math"},(0,s.kt)("mrow",{parentName:"semantics"},(0,s.kt)("mi",{parentName:"mrow"},"N"),(0,s.kt)("mspace",{parentName:"mrow",width:"1em"}),(0,s.kt)("mtext",{parentName:"mrow"},"choose"),(0,s.kt)("mspace",{parentName:"mrow",width:"1em"}),(0,s.kt)("mn",{parentName:"mrow"},"2"),(0,s.kt)("mo",{parentName:"mrow"},"="),(0,s.kt)("mfrac",{parentName:"mrow"},(0,s.kt)("mrow",{parentName:"mfrac"},(0,s.kt)("mi",{parentName:"mrow"},"N"),(0,s.kt)("mo",{parentName:"mrow"},"\u22c5"),(0,s.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,s.kt)("mi",{parentName:"mrow"},"N"),(0,s.kt)("mo",{parentName:"mrow"},"\u2212"),(0,s.kt)("mn",{parentName:"mrow"},"1"),(0,s.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,s.kt)("mn",{parentName:"mfrac"},"2")),(0,s.kt)("mspace",{parentName:"mrow",linebreak:"newline"})),(0,s.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"N\\quad\\text{choose}\\quad2 = \\frac{N\\cdot(N-1)}{2} \\\\")))),(0,s.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,s.kt)("span",{parentName:"span",className:"base"},(0,s.kt)("span",{parentName:"span",className:"strut",style:{height:"0.6944em"}}),(0,s.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.10903em"}},"N"),(0,s.kt)("span",{parentName:"span",className:"mspace",style:{marginRight:"1em"}}),(0,s.kt)("span",{parentName:"span",className:"mord text"},(0,s.kt)("span",{parentName:"span",className:"mord"},"choose")),(0,s.kt)("span",{parentName:"span",className:"mspace",style:{marginRight:"1em"}}),(0,s.kt)("span",{parentName:"span",className:"mord"},"2"),(0,s.kt)("span",{parentName:"span",className:"mspace",style:{marginRight:"0.2778em"}}),(0,s.kt)("span",{parentName:"span",className:"mrel"},"="),(0,s.kt)("span",{parentName:"span",className:"mspace",style:{marginRight:"0.2778em"}})),(0,s.kt)("span",{parentName:"span",className:"base"},(0,s.kt)("span",{parentName:"span",className:"strut",style:{height:"2.113em",verticalAlign:"-0.686em"}}),(0,s.kt)("span",{parentName:"span",className:"mord"},(0,s.kt)("span",{parentName:"span",className:"mopen nulldelimiter"}),(0,s.kt)("span",{parentName:"span",className:"mfrac"},(0,s.kt)("span",{parentName:"span",className:"vlist-t vlist-t2"},(0,s.kt)("span",{parentName:"span",className:"vlist-r"},(0,s.kt)("span",{parentName:"span",className:"vlist",style:{height:"1.427em"}},(0,s.kt)("span",{parentName:"span",style:{top:"-2.314em"}},(0,s.kt)("span",{parentName:"span",className:"pstrut",style:{height:"3em"}}),(0,s.kt)("span",{parentName:"span",className:"mord"},(0,s.kt)("span",{parentName:"span",className:"mord"},"2"))),(0,s.kt)("span",{parentName:"span",style:{top:"-3.23em"}},(0,s.kt)("span",{parentName:"span",className:"pstrut",style:{height:"3em"}}),(0,s.kt)("span",{parentName:"span",className:"frac-line",style:{borderBottomWidth:"0.04em"}})),(0,s.kt)("span",{parentName:"span",style:{top:"-3.677em"}},(0,s.kt)("span",{parentName:"span",className:"pstrut",style:{height:"3em"}}),(0,s.kt)("span",{parentName:"span",className:"mord"},(0,s.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.10903em"}},"N"),(0,s.kt)("span",{parentName:"span",className:"mspace",style:{marginRight:"0.2222em"}}),(0,s.kt)("span",{parentName:"span",className:"mbin"},"\u22c5"),(0,s.kt)("span",{parentName:"span",className:"mspace",style:{marginRight:"0.2222em"}}),(0,s.kt)("span",{parentName:"span",className:"mopen"},"("),(0,s.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.10903em"}},"N"),(0,s.kt)("span",{parentName:"span",className:"mspace",style:{marginRight:"0.2222em"}}),(0,s.kt)("span",{parentName:"span",className:"mbin"},"\u2212"),(0,s.kt)("span",{parentName:"span",className:"mspace",style:{marginRight:"0.2222em"}}),(0,s.kt)("span",{parentName:"span",className:"mord"},"1"),(0,s.kt)("span",{parentName:"span",className:"mclose"},")")))),(0,s.kt)("span",{parentName:"span",className:"vlist-s"},"\u200b")),(0,s.kt)("span",{parentName:"span",className:"vlist-r"},(0,s.kt)("span",{parentName:"span",className:"vlist",style:{height:"0.686em"}},(0,s.kt)("span",{parentName:"span"}))))),(0,s.kt)("span",{parentName:"span",className:"mclose nulldelimiter"}))),(0,s.kt)("span",{parentName:"span",className:"mspace newline"}))))),(0,s.kt)("p",{parentName:"div"},"...also known as the 2nd diagonal in pascal's triangle:"),(0,s.kt)("pre",{parentName:"div"},(0,s.kt)("code",{parentName:"pre"},"N\n0           1\n1         1   1   \u2199\n2       1   2   1\n3     1   3   3   1\n4   1   4   6   4   1\n          etc.\n")),(0,s.kt)("p",{parentName:"div"},"In R, you can  compute this using the ",(0,s.kt)("inlineCode",{parentName:"p"},"choose()")," function - or just do ",(0,s.kt)("inlineCode",{parentName:"p"},"N*(N-1)/2")," as above, which is what I've done in\nthe function below."))),(0,s.kt)("p",null,"and so on.  "),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-r"},"average_number_of_pairwise_differences = function(\n    haplotypes\n) {\n    N = ncol(haplotypes)\n    total = 0\n    # Sum over all pairs\n    for( i in 1:(N-1) ) {\n        for( j in (i+1):N ) {\n            a = haplotypes[,i]\n            b = haplotypes[,j]\n            total = total + sum( a != b )\n        }\n    }\n    # The total \n    return( total / (N*(N-1)/2))\n}\n\naverage_number_of_pairwise_differences( GT )\n")),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre"},"1811.239\n")),(0,s.kt)("p",null,"So haplotypes differ by about 1800 mutations on average, across this 1.1Mb region - or about 1.6 mutations per kilobase."),(0,s.kt)("h2",{id:"challenge-questions"},"Challenge questions"),(0,s.kt)("p",null,"Here are some challenges:"),(0,s.kt)("div",{className:"admonition admonition-tip alert alert--success"},(0,s.kt)("div",{parentName:"div",className:"admonition-heading"},(0,s.kt)("h5",{parentName:"div"},(0,s.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,s.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,s.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"Challenge 1")),(0,s.kt)("div",{parentName:"div",className:"admonition-content"},(0,s.kt)("p",{parentName:"div"},"The ",(0,s.kt)("em",{parentName:"p"},"FUT2")," gene is in this data around positions 48,695,971 - 48,705,951."),(0,s.kt)("p",{parentName:"div"},"Can you make a version of the haplotype plot that shows all haplotypes as before, but the ordering is based only on the\nSNPs in ",(0,s.kt)("em",{parentName:"p"},"FUT2")," or a small region around it?"))),(0,s.kt)("div",{className:"admonition admonition-tip alert alert--success"},(0,s.kt)("div",{parentName:"div",className:"admonition-heading"},(0,s.kt)("h5",{parentName:"div"},(0,s.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,s.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,s.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"Challenge 2")),(0,s.kt)("div",{parentName:"div",className:"admonition-content"},(0,s.kt)("p",{parentName:"div"},"In the ",(0,s.kt)("a",{parentName:"p",href:"/whg-training-resources/genome_wide_association_studies/genome_wide_association_analysis/"},"genome-wide association study\npractical")," you found an association in\nthe ",(0,s.kt)("em",{parentName:"p"},"FUT2")," gene. Can you make a two-panel version of the haplotype plot, with the top panel being haplotypes that carry\nthe alternate allele of this associated SNP, and the lower panel being haplotypes that don't?"),(0,s.kt)("p",{parentName:"div"},(0,s.kt)("strong",{parentName:"p"},"Hints"),":"),(0,s.kt)("ul",{parentName:"div"},(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("p",{parentName:"li"},"You can look up the position of the lead GWAS SNPs in the ",(0,s.kt)("inlineCode",{parentName:"p"},"metadata")," variable.  (Both datasets are in GRCh37 'build 37' coords.)")),(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("p",{parentName:"li"},"You can get the genotypes for the SNP (of course) out of the ",(0,s.kt)("inlineCode",{parentName:"p"},"GT")," matrix.")),(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("p",{parentName:"li"},"Use ",(0,s.kt)("inlineCode",{parentName:"p"},"layout()")," in R to make a two-panel plot, e.g.:"))),(0,s.kt)("pre",{parentName:"div"},(0,s.kt)("code",{parentName:"pre",className:"language-r"},"layout( matrix( 1:2, ncol = 1 ))\n")),(0,s.kt)("p",{parentName:"div"},"and then plot the panels in order."))),(0,s.kt)("p",null,"Good luck!"))}h.isMDXComponent=!0},7976:(e,a,t)=>{t.d(a,{Z:()=>n});const n=t.p+"assets/images/folded_sfs-30031c7ab74c884faa452c242b8fc521.png"},3971:(e,a,t)=>{t.d(a,{Z:()=>n});const n=t.p+"assets/images/haplotypes-42bc805ffcffa8aa8c7d53ba9e5a0b35.png"},6482:(e,a,t)=>{t.d(a,{Z:()=>n});const n=t.p+"assets/images/sfs-0ae849c4ee9c2e24c07e2574538297ff.png"}}]);