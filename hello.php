<html>
 <head>
  <title>PHP Test</title>
 </head>
 <body>
 <?php echo '<p>Hello World</p>'; ?> 

     <?php
    $loc = file_get_contents('https://ipapi.co/json/');
    echo $loc;
    $obj = json_decode($loc);
?>

 </body>
</html>


