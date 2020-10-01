export default function ({ $axios, redirect, req, store }) {
  $axios.onError((error) => {
    // console.log('axios error', error)
  })
}
