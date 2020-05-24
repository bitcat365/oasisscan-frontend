export default function ({ $axios, redirect }) {
  $axios.onError((error) => {
    console.log('axios error', error)
  })
}
