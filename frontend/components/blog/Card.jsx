import {useEffect, useState} from "react";
import Link from "next/link";
import moment from "moment";
moment.locale("es");
import reactHTML from "react-render-html";

const Card = (props) => {
  const {blog} = props;
  const [loading, setLoading] = useState(false);

  const renderCategories = () => {
    return blog.categories.map(category => {
      return (
        <Link key={category._id} href="/category/[slug]" as={`/category/${category.slug}`}>
          <a className="btn btn-dark btn-sm mr-1 ml-1">{category.name}</a>
        </Link>
      )
    })
  }

  const renderTags = () => {
    return blog.tags.map(tag => {
      return (
        <Link key={tag._id} href="/tag/[slug]" as={`/tag/${tag.slug}`}>
          <a className="btn btn-dark btn-sm mr-1 ml-1">{tag.name}</a>
        </Link>
      )
    })
  }

  return (
    <div className="lead py-3 px-4 shadow">
      <header>
        <Link href="/blogs/[slug]" as={`/blogs/${blog.slug}`}>
          <a><h2 className="font-weight-bold mb-3">{blog.title}</h2></a>
        </Link>
      </header>
      <section className="mb-3">
        <small style={{display: "inline-block", padding: "5px 10px"}} className="mark ml-1 text-muted text-small">
          Autor: <Link href="/profile/[username]" as={`/profile/${blog.postedBy.username}`}>
              <a>{blog.postedBy.name}</a>
            </Link> | Creado: {moment(blog.createdAt).calendar()} | Actualizado: {moment(blog.updatedAt).calendar()}
        </small>
      </section>
      <section className="mb-4" style={{display: "flex"}}>
        <div className="mr-2">
          <small className="text-muted">Categorías: </small>
          {renderCategories()}
        </div>
        <div>
          <small className="text-muted">Tags: </small>
          {renderTags()}
        </div>
      </section>
      <hr/>
      <div className="row mx-0">
        <div className="col-md-4">
          <section style={{position: "relative", minHeight: "150px"}}>
            {loading &&
              <div
                style={{position: "absolute", width: "250px", height: "150px", backgroundColor: "#fff"}}
                className="d-flex align-items-center justify-content-center"
              >
                <div className="spinner-border text-primary" role="status">
                  <span className="sr-only">Cargando...</span>
                </div>
              </div>
            }
            <img
              className="img img-fluid"
              style={{display: "block", maxHeight: "150px", width: "auto"}}
              src={blog.mainPhoto}
              alt={`${blog.title}`}
            />
          </section>
        </div>
        <div className="col-md-8">
          <section>
            {reactHTML(blog.excerpt)}{" "}
            <Link href="/blogs/[slug]" as={`/blogs/${blog.slug}`}>
              <a className="btn btn-action btn-sm">Leer más...</a>
            </Link>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Card;