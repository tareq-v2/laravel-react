<!DOCTYPE html>
<html>
<head>
    <link rel="shortcut icon" href="react.png" type="image/x-icon">
    <title>React</title>
    <meta name="csrf-token" content="{{csrf_token()}}">
    <!-- ... -->
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
</head>
<body>
    <div id="root"></div>
    <script 
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDq2asAtKU756FskGWy-FjN7vIzo2Jufeg&libraries=places"
        async
        defer
    ></script>
</body>
</html>