---
no_index: true
modal:
  template: login
  headline: "To access this content you need to provide your email address"
  form:
    id: 882282
    uid: dfa842b614
    subscribe_text: "Access content!"
    classes:
      button: uppercase text-sm text-white focus:outline-0 w-full sm:w-auto bg-blue-darker
      hover: bg-grey-darkest focus:bg-grey-light tracking-wide px-6 ml-8
      form: mt-4 w-full
      fields: sm:flex
      error: text-red-darker mb-4
      input: max-w-sm block border border-transparent focus:border-grey-light rounded transition w-full focus:outline-0 bg-grey-lighter py-3 px-6 mb-2 sm:mb-0 flex-grow
    data:
      options:
        settings:
          after_subscribe:
            success_message: ""
            action: redirect
            redirect_url: https://civic.vision/geospatial-data-visualization/f4gsd/resources
          return_visitor:
            custom_content: ''
            action: hide
          recaptcha:
            enabled: false
    fields:
    - type: email
      name: email_address
      placeholder: Your email address
    - type: hidden
      name: "tags[]"
      value: 837226
---
# Geospatial Data Visualization with d3

Welcome to San Diego and welcome to "Geospatial data visualizations with d3"

## Let's get started
