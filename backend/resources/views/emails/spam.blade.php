<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 py-10 px-5">
<div class="max-w-2xl mx-auto bg-white p-8 rounded shadow">
    <h2 class="text-2xl font-bold mb-6 text-gray-700">{{ class_basename($model) }} was marked as spam</h2>
    <div>
        <p class="text-gray-700">
            {{ $model->user->name }}
            {{ $model->body }}
        </p>
    </div>
    <div>
        <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            Show {{ class_basename($model) }}
        </button>
    </div>
</div>
</body>
</html>
