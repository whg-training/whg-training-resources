"use strict";(self.webpackChunkwhg_training_resources=self.webpackChunkwhg_training_resources||[]).push([[454],{3905:(e,t,a)=>{a.d(t,{Zo:()=>m,kt:()=>c});var n=a(7294);function i(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function r(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function o(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?r(Object(a),!0).forEach((function(t){i(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):r(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function l(e,t){if(null==e)return{};var a,n,i=function(e,t){if(null==e)return{};var a,n,i={},r=Object.keys(e);for(n=0;n<r.length;n++)a=r[n],t.indexOf(a)>=0||(i[a]=e[a]);return i}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(n=0;n<r.length;n++)a=r[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(i[a]=e[a])}return i}var s=n.createContext({}),p=function(e){var t=n.useContext(s),a=t;return e&&(a="function"==typeof e?e(t):o(o({},t),e)),a},m=function(e){var t=p(e.components);return n.createElement(s.Provider,{value:t},e.children)},g="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},u=n.forwardRef((function(e,t){var a=e.components,i=e.mdxType,r=e.originalType,s=e.parentName,m=l(e,["components","mdxType","originalType","parentName"]),g=p(a),u=i,c=g["".concat(s,".").concat(u)]||g[u]||d[u]||r;return a?n.createElement(c,o(o({ref:t},m),{},{components:a})):n.createElement(c,o({ref:t},m))}));function c(e,t){var a=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var r=a.length,o=new Array(r);o[0]=u;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l[g]="string"==typeof e?e:i,o[1]=l;for(var p=2;p<r;p++)o[p]=a[p];return n.createElement.apply(null,o)}return n.createElement.apply(null,a)}u.displayName="MDXCreateElement"},2360:(e,t,a)=>{a.d(t,{Z:()=>o});var n=a(7294),i=a(6010);const r={tabItem:"tabItem_OmH5"};function o(e){let{children:t,hidden:a,className:o}=e;return n.createElement("div",{role:"tabpanel",className:(0,i.Z)(r.tabItem,o),hidden:a},t)}},9877:(e,t,a)=>{a.d(t,{Z:()=>d});var n=a(7462),i=a(7294),r=a(2389),o=a(7392),l=a(7094),s=a(2466),p=a(6010);const m={tabList:"tabList_uSqn",tabItem:"tabItem_LplD"};function g(e){const{lazy:t,block:a,defaultValue:r,values:g,groupId:d,className:u}=e,c=i.Children.map(e.children,(e=>{if((0,i.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)})),f=g??c.map((e=>{let{props:{value:t,label:a,attributes:n}}=e;return{value:t,label:a,attributes:n}})),k=(0,o.l)(f,((e,t)=>e.value===t.value));if(k.length>0)throw new Error(`Docusaurus error: Duplicate values "${k.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`);const h=null===r?r:r??c.find((e=>e.props.default))?.props.value??c[0]?.props.value;if(null!==h&&!f.some((e=>e.value===h)))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${h}" but none of its children has the corresponding value. Available values are: ${f.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);const{tabGroupChoices:v,setTabGroupChoices:y}=(0,l.U)(),[w,N]=(0,i.useState)(h),_=[],{blockElementScrollPositionUntilNextRender:b}=(0,s.o5)();if(null!=d){const e=v[d];null!=e&&e!==w&&f.some((t=>t.value===e))&&N(e)}const T=e=>{const t=e.currentTarget,a=_.indexOf(t),n=f[a].value;n!==w&&(b(t),N(n),null!=d&&y(d,n))},R=e=>{let t=null;switch(e.key){case"ArrowRight":{const a=_.indexOf(e.currentTarget)+1;t=_[a]||_[0];break}case"ArrowLeft":{const a=_.indexOf(e.currentTarget)-1;t=_[a]||_[_.length-1];break}}t?.focus()};return i.createElement("div",{className:(0,p.Z)("tabs-container",m.tabList)},i.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,p.Z)("tabs",{"tabs--block":a},u)},f.map((e=>{let{value:t,label:a,attributes:r}=e;return i.createElement("li",(0,n.Z)({role:"tab",tabIndex:w===t?0:-1,"aria-selected":w===t,key:t,ref:e=>_.push(e),onKeyDown:R,onFocus:T,onClick:T},r,{className:(0,p.Z)("tabs__item",m.tabItem,r?.className,{"tabs__item--active":w===t})}),a??t)}))),t?(0,i.cloneElement)(c.filter((e=>e.props.value===w))[0],{className:"margin-top--md"}):i.createElement("div",{className:"margin-top--md"},c.map(((e,t)=>(0,i.cloneElement)(e,{key:t,hidden:e.props.value!==w})))))}function d(e){const t=(0,r.Z)();return i.createElement(g,(0,n.Z)({key:String(t)},e))}},4230:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>m,contentTitle:()=>s,default:()=>c,frontMatter:()=>l,metadata:()=>p,toc:()=>g});var n=a(7462),i=(a(7294),a(3905)),r=a(9877),o=a(2360);const l={sidebar_position:7},s="Making a module",p={unversionedId:"programming/programming_with_gene_annotations3/making_a_module",id:"programming/programming_with_gene_annotations3/making_a_module",title:"Making a module",description:"If you've got this far, you've written a function parsegff3to_dataframe() that [passes the",source:"@site/docs/programming/programming_with_gene_annotations3/007_making_a_module.md",sourceDirName:"programming/programming_with_gene_annotations3",slug:"/programming/programming_with_gene_annotations3/making_a_module",permalink:"/whg-training-resources/programming/programming_with_gene_annotations3/making_a_module",draft:!1,editUrl:"https://github.com/whg-training/whg-training-resources/edit/main/docs/programming/programming_with_gene_annotations3/007_making_a_module.md",tags:[],version:"current",sidebarPosition:7,frontMatter:{sidebar_position:7},sidebar:"sidebar5",previous:{title:"Quick recap",permalink:"/whg-training-resources/programming/programming_with_gene_annotations3/recap"},next:{title:"Writing a useful conversion program",permalink:"/whg-training-resources/programming/programming_with_gene_annotations3/Converting_gff_to_sqlite"}},m={},g=[{value:"Taking the easy way",id:"taking-the-easy-way",level:2},{value:"Making an R package",id:"making-an-r-package",level:2},{value:"The skeleton",id:"the-skeleton",level:3},{value:"The package metadata",id:"the-package-metadata",level:3},{value:"The documentation",id:"the-documentation",level:3},{value:"Installing the package",id:"installing-the-package",level:3},{value:"Taking it for a spin",id:"taking-it-for-a-spin",level:3},{value:"Next steps",id:"next-steps",level:2}],d={toc:g},u="wrapper";function c(e){let{components:t,...a}=e;return(0,i.kt)(u,(0,n.Z)({},d,a,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"making-a-module"},"Making a module"),(0,i.kt)("p",null,"If you've got this far, you've written a function ",(0,i.kt)("inlineCode",{parentName:"p"},"parse_gff3_to_dataframe()")," that ",(0,i.kt)("a",{parentName:"p",href:"./Getting_started_writing_some_code.md#test-driven-development"},"passes the\ntest"),".  And ope"),(0,i.kt)("p",null,"That's already cool but let's go one step further - let's turn it into an R package (or python module.)"),(0,i.kt)("p",null,"It's pretty easy."),(0,i.kt)("h2",{id:"taking-the-easy-way"},"Taking the easy way"),(0,i.kt)("p",null,"The simplest way is to just put it in a single file, like this:"),(0,i.kt)(r.Z,{groupId:"language",mdxType:"Tabs"},(0,i.kt)(o.Z,{value:"R",label:"In R",mdxType:"TabItem"},(0,i.kt)("p",null,"Copy and paste the function and paste it into a new file, called ",(0,i.kt)("inlineCode",{parentName:"p"},"gff.R"),", in the current directory.\n(For good measure, paste the test function as well.)"),(0,i.kt)("p",null,"To load this into your R session, you can use the ",(0,i.kt)("inlineCode",{parentName:"p"},"source()")," function:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-r"},"source( 'gff.R' )\nX = parse_gff_to_dataframe( \"gencode.v41.annotation.head.gff\" )\n"))),(0,i.kt)(o.Z,{value:"python",label:"In python",mdxType:"TabItem"},(0,i.kt)("p",null,"Making a python module is easy:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},"Copy your code into a new file, named ",(0,i.kt)("inlineCode",{parentName:"p"},"gmsgff.py")," using a ",(0,i.kt)("a",{parentName:"p",href:"/whg-training-resources/prerequisites/editor"},"text editor"),". (This file\nshould go in your current directory i.e. the one you started python / jupyterhub from.)")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},"Congratulations!  You have now written your first python module."))),(0,i.kt)("p",null,"To use your python module, simply import it and use like this:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-python"},"import gmsgff\nX = gmsgff.parse_gff3_to_dataframe( 'gencode.v41.annotation.head.gff' )\n")),(0,i.kt)("p",null,"or if you don't want to type the \"",(0,i.kt)("inlineCode",{parentName:"p"},"gmsgff."),'" before the function name:'),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-python"},"from gmsgff import parse_gff3_to_dataframe\nX = parse_gff3_to_dataframe( 'gencode.v41.annotation.head.gff' )\n")),(0,i.kt)("p",null,"Cool!"))),(0,i.kt)("h2",{id:"making-an-r-package"},"Making an R package"),(0,i.kt)("p",null,"Making a single file like this is ok, but in R it's not a full package.  If you are working in R, let's make one now. "),(0,i.kt)("p",null,"Making an R package is in fact a big topic - ",(0,i.kt)("a",{parentName:"p",href:"https://r-pkgs.org"},"whole books")," have been written about it. If you are\nwanting to build and maintain R packages more often, you should definitely read that book (and use the suggested tools).\nBut for now, we'll use base R approaches to get it working.  "),(0,i.kt)("h3",{id:"the-skeleton"},"The skeleton"),(0,i.kt)("p",null,"To get started, first you need to start with an empty R workspace that has ",(0,i.kt)("strong",{parentName:"p"},"only")," the functions you want in it. So,\nstart a new R session (quit the old one if you want) and paste in the definition of ",(0,i.kt)("inlineCode",{parentName:"p"},"parse_gff3_to_dataframe()"),"."),(0,i.kt)("p",null,"Now, to create an R package, use ",(0,i.kt)("inlineCode",{parentName:"p"},"package.skeleton()"),'.  Let\'s call our package "gmsgff":'),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-r"},'package.skeleton( "gmsgff" )\n')),(0,i.kt)("p",null,"This will create a new directory called 'gmsgff' in the working directory.  If you look inside it you will see a few\nthings:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"gmsgff/\n  NAMESPACE\n  DESCRIPTION\n  Read-and-delete-me\n  man/\n    gmsgff-package.Rd\n    parse_gff3_to_dataframe.Rd\n  R/\n    parse_gff3_to_dataframe.R\n")),(0,i.kt)("p",null,"Have a look at these files now using your preferred method.  They are:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"The ",(0,i.kt)("inlineCode",{parentName:"li"},"NAMESPACE")," and ",(0,i.kt)("inlineCode",{parentName:"li"},"DESCRIPTION")," files are package metadata - we will have to edit these to make the package work"),(0,i.kt)("li",{parentName:"ul"},"The ",(0,i.kt)("inlineCode",{parentName:"li"},"parse_gff3_to_dataframe.R")," file contains your function."),(0,i.kt)("li",{parentName:"ul"},"The ",(0,i.kt)("inlineCode",{parentName:"li"},"gmsgff-package.Rd")," and ",(0,i.kt)("inlineCode",{parentName:"li"},"parse_gff3_to_dataframe.Rd")," file contain the package documentation - we'll have to edit these too.")),(0,i.kt)("p",null,"(You can read, and if you wish delete, ",(0,i.kt)("inlineCode",{parentName:"p"},"Read-md-and-delete-me"),".)"),(0,i.kt)("h3",{id:"the-package-metadata"},"The package metadata"),(0,i.kt)("p",null,"Let's go through these in order.  You can also see a completed version of the package ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/whg-training/whg-training-resources/tree/main/docs/programming/programming_with_gene_annotations3/code/R/gmsgff"},"on\ngithub"),"."),(0,i.kt)("p",null,"First let's edit ",(0,i.kt)("inlineCode",{parentName:"p"},"NAMESPACE"),", which declares what the package imports (in our case, ",(0,i.kt)("inlineCode",{parentName:"p"},"readr")," and\n",(0,i.kt)("inlineCode",{parentName:"p"},"stringr"),'), and what it "exports" (in our case, the ',(0,i.kt)("inlineCode",{parentName:"p"},"parse_gff3_to_dataframe()")," function.)  It should look like this:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},'import( readr )\nimport( stringr )\nexport("parse_gff3_to_dataframe")\n')),(0,i.kt)("p",null,"Easy enough."),(0,i.kt)("p",null,"Second, ",(0,i.kt)("inlineCode",{parentName:"p"},"DESCRIPTION"),", which (you've guessed it!) describes the package.  Edit it to give relevant values, e.g. mine looks like this:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"Package: gmsgff\nType: Package\nTitle: Utilities for loading gene annotation data\nVersion: 0.1\nDate: 2023-10-13\nAuthor: My Name\nMaintainer: My Name <my.email@server.info>\nDescription: Provides parse_gff3_to_dataframe\nLicense: mit_license\n")),(0,i.kt)("div",{className:"admonition admonition-caution alert alert--warning"},(0,i.kt)("div",{parentName:"div",className:"admonition-heading"},(0,i.kt)("h5",{parentName:"div"},(0,i.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,i.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 16 16"},(0,i.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M8.893 1.5c-.183-.31-.52-.5-.887-.5s-.703.19-.886.5L.138 13.499a.98.98 0 0 0 0 1.001c.193.31.53.501.886.501h13.964c.367 0 .704-.19.877-.5a1.03 1.03 0 0 0 .01-1.002L8.893 1.5zm.133 11.497H6.987v-2.003h2.039v2.003zm0-3.004H6.987V5.987h2.039v4.006z"}))),"Important")),(0,i.kt)("div",{parentName:"div",className:"admonition-content"},(0,i.kt)("p",{parentName:"div"},"There is one extra line in this file you will need as well - to tell it about the dependency on the tidyverse packages :"),(0,i.kt)("pre",{parentName:"div"},(0,i.kt)("code",{parentName:"pre"},"Imports: stringr, readr\n")),(0,i.kt)("p",{parentName:"div"},"Make sure and add this to the end."))),(0,i.kt)("h3",{id:"the-documentation"},"The documentation"),(0,i.kt)("p",null,"To try to install the package, you can run ",(0,i.kt)("inlineCode",{parentName:"p"},"R CMD INSTALL gmsgff")," from the command-line:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"% R CMD INSTALL gmsgff\n")),(0,i.kt)("p",null,"But you will probably see an error like:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"Error in Rd_info(db[[i]]) : \n  missing/empty \\title field in '/private/var/folders/1j/6glxfbj173d604n6mx1zh30c0000gn/T/Rtmp14vvWH/Rbuild772d141c32f6/gmsgff/man/parse_gff3_to_dataframe.Rd'\nRd files must have a non-empty \\title.\nSee chapter 'Writing R documentation' in manual 'Writing R Extensions'.\n* removing \u2018/private/var/folders/1j/6glxfbj173d604n6mx1zh30c0000gn/T/Rtmp14vvWH/Rinst772d4755beca/gmsgff\u2019\n      -----------------------------------\nERROR: package installation failed\n\n")),(0,i.kt)("p",null,"What this means is that ",(0,i.kt)("strong",{parentName:"p"},"R won't let us install it until we have written documentation"),".  (Oh dear.)"),(0,i.kt)("p",null,"There are in fact two documentation files to write, and if you look at them you'll see they look a bit complicated.  For\nexample ",(0,i.kt)("inlineCode",{parentName:"p"},"gmsgff/man/gmsgff-package.Rd")," starts like this:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"\\name{gmsgff-package}\n\\alias{gmsgff-package}\n\\alias{gmsgff}\n\\docType{package}\n\\title{\n\\packageTitle{gmsgff}\n}\n\\description{\n\\packageDescription{gmsgff}\n}\n\\details{\n  (etc)\n")),(0,i.kt)("p",null,"A bit complicated!"),(0,i.kt)("p",null,"To get this working for this tutorial I suggest just copying the files I quickly made for this:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://raw.githubusercontent.com/whg-training/whg-training-resources/main/docs/programming/programming_with_gene_annotations3/code/R/gmsgff/man/gmsgff-package.Rd"},"gmsgff-package.Rd")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://raw.githubusercontent.com/whg-training/whg-training-resources/main/docs/programming/programming_with_gene_annotations3/code/R/gmsgff/man/parse_gff3_to_dataframe.Rd"},"parse_gff3_to_dataframe.Rd"))),(0,i.kt)("p",null,"For example you could download these files and replace your original ones.  Please have a look at them and edit anything\nyou want to improve."),(0,i.kt)("div",{className:"admonition admonition-tip alert alert--success"},(0,i.kt)("div",{parentName:"div",className:"admonition-heading"},(0,i.kt)("h5",{parentName:"div"},(0,i.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,i.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,i.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"Note")),(0,i.kt)("div",{parentName:"div",className:"admonition-content"},(0,i.kt)("p",{parentName:"div"},"The ",(0,i.kt)("a",{parentName:"p",href:"https://r-pkgs.org"},"r-pks.org site")," suggests to use another package called\n",(0,i.kt)("a",{parentName:"p",href:"https://cran.r-project.org/web/packages/roxygen2/vignettes/roxygen2.html"},"roxygen")," to document your package instead.\nThis is a bit easier, because you can put documentation in the same file as your code, and it will process it into the\nneeded files.  But we won't do this for now."))),(0,i.kt)("h3",{id:"installing-the-package"},"Installing the package"),(0,i.kt)("p",null,"Ok let's try it out!  In the command-line run:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"% R CMD INSTALL gmsgff\n")),(0,i.kt)("p",null,"With luck you should see a bunch of messages ending wtih"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"** testing if installed package can be loaded from temporary location\n** testing if installed package can be loaded from final location\n** testing if installed package keeps a record of temporary installation path\n* DONE (gmsgff)\n")),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Congratulations!")," You've written the ",(0,i.kt)("strong",{parentName:"p"},"gmsgff")," R package."),(0,i.kt)("h3",{id:"taking-it-for-a-spin"},"Taking it for a spin"),(0,i.kt)("p",null,"Try it like this: start a new R session and type"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},'library(gmsgff)\ngencode = parse_gff3_to_dataframe( "gencode.v41.annotation.gff3" )\n')),(0,i.kt)("p",null,"Or like this:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},'gencode = gmsgff::parse_gff3_to_dataframe( "gencode.v41.annotation.gff3" )\n')),(0,i.kt)("p",null,"Does it work?"),(0,i.kt)("div",{className:"admonition admonition-tip alert alert--success"},(0,i.kt)("div",{parentName:"div",className:"admonition-heading"},(0,i.kt)("h5",{parentName:"div"},(0,i.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,i.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,i.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"Note")),(0,i.kt)("div",{parentName:"div",className:"admonition-content"},(0,i.kt)("p",{parentName:"div"},"You can also read the package help - try"),(0,i.kt)("pre",{parentName:"div"},(0,i.kt)("code",{parentName:"pre"},"?parse_gff3_to_dataframe\n")),(0,i.kt)("p",{parentName:"div"},"###\xa0Adding the tests"),(0,i.kt)("p",{parentName:"div"},"If you look in ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/whg-training/whg-training-resources/tree/main/docs/programming/programming_with_gene_annotations3/code/R/gmsgff"},"my\nversion"),"\nyou'll see some additions I made to add the test code.  In short:"),(0,i.kt)("ul",{parentName:"div"},(0,i.kt)("li",{parentName:"ul"},"I added the test function in ",(0,i.kt)("inlineCode",{parentName:"li"},"tests/test_parse_gff_to_dataframe.R"),", with a little bit of boilerplate"),(0,i.kt)("li",{parentName:"ul"},"I added a ",(0,i.kt)("inlineCode",{parentName:"li"},"Suggests: unittest")," line to the ",(0,i.kt)("inlineCode",{parentName:"li"},"DESCRIPTION")," file.")),(0,i.kt)("p",{parentName:"div"},"It's a good idea to keep the test in the package, so go ahead and add your tests now - then use ",(0,i.kt)("inlineCode",{parentName:"p"},"R CMD INSTALL")," to install it again."))),(0,i.kt)("p",null,"This was pretty easy, however ",(0,i.kt)("a",{parentName:"p",href:"https://r-pkgs.org"},(0,i.kt)("inlineCode",{parentName:"a"},"r-pks.org")," site")," advises to use another test package called\n",(0,i.kt)("inlineCode",{parentName:"p"},"testthat"),", which is probably what you should use in real work.\n:::"),(0,i.kt)("h2",{id:"next-steps"},"Next steps"),(0,i.kt)("p",null,"Great!  We have a fully functional, fully tested gff-loading package! Now let's use it to ",(0,i.kt)("a",{parentName:"p",href:"Converting_gff_to_sqlite.md"},"write a useful command-line\nprogram"),"."))}c.isMDXComponent=!0}}]);