import {useState} from "react";
import {withRouter} from "next/router";
import Head from "next/head";
import Link from "next/link";
import Layout from "../../components/Layout";
import {getBlogsWithCategoriesAndTags} from "../../actions/blog";
import Card from "../../components/blog/Card";
// import {API, DOMAIN, APP_NAME} from "../../config";

const APP_NAME = process.env.APP_NAME;
const DOMAIN = process.env.NODE_ENV === "production" ? process.env.DOMAIN_PROD : process.env.DOMAIN_DEV;

const Blogs = (props) => {
  const {blogs, categories, tags, results, blogsLimit, blogSkip, error, router} = props;

  const [limit, setLimit] = useState(blogsLimit);
  const [skip, setSkip] = useState(blogSkip);
  const [blogsResults, setBlogsResults] = useState(results);
  const [loadedBlogs, setLoadedBlogs] = useState(blogs);
  const [loading, setLoading] = useState(false);

  // Funcionalidad para cargar más blogs
  const loadMoreBlogs = async () => {
    let skippedBlogs = skip + limit;
    setLoading(true);
    try {
      const res = await getBlogsWithCategoriesAndTags(limit, skippedBlogs);      
      setLoading(false);
      setLoadedBlogs([...loadedBlogs, ...res.data.data.blogs]);
      setBlogsResults(res.data.data.results)
      setSkip(skippedBlogs)
    } catch (error) {
      setLoading(false);
      console.log(error.message) 
    }
  }

  // Funcionalidad para mostrar todas las categorías
  const renderAllCategories = () => {
    return categories.map(category => {
      return (
        <Link key={category._id} href={`/category/${category.slug}`}>
          <a className="btn btn-dark btn-sm mr-1 ml-1">{category.name}</a>
        </Link>
      )
    })
  }

  // Funcionalidad para mostrar todos los tags
  const renderAllTags = () => {
    return tags.map(tag => {
      return (
        <Link key={tag._id} href={`/tag/${tag.slug}`}>
          <a className="btn btn-dark btn-sm mr-1 ml-1">{tag.name}</a>
        </Link>
      )
    })
  }

  // Funcionalidad para mostrar los blogs
  const renderBlogs = () => {
    return loadedBlogs.map(blog => {
      return (
        <article key={blog._id} className="mb-4">
          <Card blog={blog} />
        </article>
      )
    })
  }

  // Botón para cargar más blogs
  // Mostrar el botón sólo cuando los resultados iniciales sean mayor que cero y
  // cuando los resultados posteriores sean mayores o iguales que el limit
  const loadMoreBtn = () => {
    return (
      results > 0 && blogsResults >= blogsLimit &&
      <div className="text-center">
        <button
          disabled={loading}
          className="btn btn-action"
          onClick={loadMoreBlogs}
        >
          {loading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"/>}
          {!loading ? "Cargar más blogs" : " Cargando..."}
        </button>
      </div>
    )
  }

  // Contenido del Head de la página para SEO
  const head = () => {
    return (
      <Head>
        <title>Blogs de Programación y Tecnologías Web| {APP_NAME}</title>
        <meta
          name="description"
          content="Blogs y tutoriales de programación sobre JavaScript, ReactJS, NodeJS, VueJS y más..."
        />
        <meta
          property="og:title"
          content={`Los blogs más recientes sobre Programación y Tecnologías Web`}
        />
        <meta
          property="og:description"
          content="Blogs y tutoriales de programación sobre JavaScript, ReactJS, NodeJS, VueJS y más..."
        />
        <meta
          property="og:type"
          content="web site"
        />
        <meta
          property="og:url"
          content={`${DOMAIN}${router.pathname}`}
        />
        <meta
          property="og:site_name"
          content={`${DOMAIN}`}
        />
        <meta
          property="og:image"
          content={`${DOMAIN}/images/landing-background.jpg`}
        />
        <meta
          property="og:image:secure_url"
          content={`${DOMAIN}/images/landing-background.jpg`}
        />
        <meta
          property="og:image:type"
          content={"image/jpg"}
        />
        <link rel="canonical" href={`${DOMAIN}${router.pathname}`}/>
      </Head>
    )
  }

  const showError = () => {
    return <div className="alert alert-danger text-center py-4"><h5>{error}</h5></div>
    }

  return (
    <React.Fragment>
      {head()}
      <Layout>
        <main>
          {error && showError()}
          {!error && results === 0 &&
            <header>
              <div className="col-md-12">
                <h1 className="text-center font-weight-bold mb-4">
                  Aún no hay blogs creados.
                </h1>
              </div>
            </header>
          }
          {!error && results > 0 &&
            <React.Fragment>
              <div className="container-fluid">
                <header>
                  <div className="col-md-12">
                    <h1 className="text-center font-weight-bold mb-4">
                      Blogs y Tutoriales de Programación y Tecnologías Web
                    </h1>
                  </div>
                  <section className="mb-4">
                    <div className="mb-3 text-center">
                      {renderAllCategories()}
                    </div>
                    <div className="text-center">
                      {renderAllTags()}
                    </div>
                  </section>
                </header>
              </div>
              <hr/>
              <div className="container-fluid">
                {renderBlogs()}
              </div>
              <div className="container-fluid">
                {loadMoreBtn()}
              </div>
            </React.Fragment>
          }
        </main>
      </Layout>
    </React.Fragment>
  )
}

Blogs.getInitialProps = async () => {
  try {
    const skip = 0;
    const limit = 2;
    const res = await getBlogsWithCategoriesAndTags(limit, skip);
    return {
      blogs: res.data.data.blogs,
      categories: res.data.data.categories,
      tags: res.data.data.tags,
      results: res.data.data.results,
      blogsLimit: limit,
      blogSkip: skip,
      error: null
    }
  } catch (error) {
    if(error.message.includes("ECONNREFUSED") || error.message.includes("connect")) {
      return{
        error: "Ocurrió un error al cargar los datos. Intente de nuevo."
      }
    }

    return {
      error: error.message
    }
  }
}

export default withRouter(Blogs);