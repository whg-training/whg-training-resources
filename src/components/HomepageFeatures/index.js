import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
    {
      title: 'Getting setup',
      url: 'prerequisites',
      Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
      //png:  "https://res.cloudinary.com/dwccfildc/c_limit,f_auto,w_1140/v1637151402/prod/4e093e2e53f12df612635bd5bf54ad58.jpg",
      description: (
        <>
          Learn how to set up your compute environment for genomics work.
        </>
      ),
  },
  {
      title: 'Basic bioinformatics',
      url: 'bioinformatics',
      Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
      //png:  "https://res.cloudinary.com/dwccfildc/c_limit,f_auto,w_1140/v1637151402/prod/4e093e2e53f12df612635bd5bf54ad58.jpg",
      description: (
        <>
          Get started with some basic tools of the trade.
        </>
      ),
  },
  {
    title: 'Programming',
    url: 'programming',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Learn how to carry out scientific coding in python, R, and bash.
      </>
    ),
  },
  {
    title: 'Data visualisation',
    url: 'data_visualisation',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Learn how to interpret and present data through impactful visualisations.
      </>
    ),
  },
  {
    title: 'Statistics',
    url: 'statistical_modelling',
    Svg: require('@site/static/img/stats.svg').default,
    description: (
      <>
        Learn about probability, statistical modelling, and association.
      </>
    ),
  },

  {
    title: 'Population genetics',
    url: 'population_genetics',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Conduct and interpret a simulated GWAS study, and finemapping.
      </>
    ),
  },
  {
    title: 'Genome-wide association',
    url: 'genome_wide_association_studies',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    //png: 'static/img/gwas.png',

    description: (
      <>
        Conduct and interpret a simulated GWAS study, and finemapping.
      </>
    ),
  },
  {
    title: 'Sequencing data analysis',
    url: 'sequence_data_analysis',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Learn how to interpret, align, and analyse genomic sequence data.
      </>
    ),
  },

];

function Feature({Svg, title, url, description}) {
  return (
    <div className={clsx('col col--3')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <a href={url}><h3>{title}</h3></a>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
      {/* First row */}
        <div className="row">
          {FeatureList.slice(0,4).map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      {/* Second row */}
      <div className="row">
          {FeatureList.slice(4,8).map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
