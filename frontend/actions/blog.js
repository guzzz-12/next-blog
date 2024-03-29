import axios from "axios";
import queryString from "query-string";
// import {API} from "../config";
const API = process.env.NODE_ENV === "production" ? process.env.API : process.env.API_DEV;

// Crear un blog
export const createBlog = async (blogData, token) => {
  // Chequear el rol del usuario para determinar a qué ruta debe enviar la data del blog
  const userRole = JSON.parse(localStorage.getItem("user")).role;

  return await axios({
    method: "POST",
    url: userRole === 1 ? `${API}/api/blog` : `${API}/api/user/blog`,
    data: blogData,
    headers: {
      "Content-Type":'multipart/form-data',
      Authorization: `Bearer ${token}`
    }
  })
}

// Editar un blog
export const updateBlog = async (blogData, slug, token) => {
  // Chequear el rol del usuario para determinar a qué ruta debe enviar la data del blog
  const userRole = JSON.parse(localStorage.getItem("user")).role;

  return await axios({
    method: "PATCH",
    url: userRole === 1 ? `${API}/api/blog/${slug}` : `${API}/api/user/blog/${slug}`,
    data: blogData,
    headers: {
      "Content-Type":'multipart/form-data',
      Authorization: `Bearer ${token}`
    }
  })
}

// Borrar un blog
export const deleteBlog = async (slug, token) => {
  // Chequear el rol del usuario para determinar a qué ruta debe enviar la data del blog
  const userRole = JSON.parse(localStorage.getItem("user")).role;
  
  return await axios({
    method: "DELETE",
    url: userRole === 1 ? `${API}/api/blog/${slug}` : `${API}/api/user/blog/${slug}`,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  })
}

// Buscar todos los blogs
export const getAllBlogs = async () => {
  return await axios({
    method: "GET",
    url: `${API}/api/blogs`,
    headers: {
      "Content-Type": "application/json"
    }
  })
}

// Tomar todos los blogs con sus categorías
export const getBlogsWithCategoriesAndTags = async (limit, skip) => {
  return await axios({
    method: "POST",
    url: `${API}/api/blogs-categories-tags`,
    data: {
      limit,
      skip
    },
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  })
}

// Tomar un blog específico
export const getSingleBlog = async (slug) => {
  return await axios({
    method: "GET",
    url: `${API}/api/blog/${slug}`
  })
}

// Buscar los blogs relacionados
export const getRelatedBlogs = async (blogData) => {
  return await axios({
    method: "POST",
    url: `${API}/api/blogs/blogs-related`,
    data: {
      blogId: blogData.id,
      blogCategories: blogData.categories
    },
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  })
}

// Buscar blogs mediante argumento de búsqueda
export const searchBlogs = async (params) => {
  const query = queryString.stringify(params);
  return await axios({
    method: "GET",
    url: `${API}/api/blogs/search?${query}`
  })
}

// Buscar los blogs del usuario autenticado
export const getAllUserBlogs = async (token) => {
  return await axios({
    method: "GET",
    url: `${API}/api/user-blogs`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  })
}