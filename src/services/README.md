# services, config et consommation des APIs du Backend

## ki bech tconsommi APi mel backend juste esta3mel **`axiosAPI` (importiha men AxiosAPI folder)** fi **3oudh axios.create()** kima fel exemple li louta

### exemple URL : **`http://localhost:8080/api/users/register`** just axiosAPi a3tih `/users/register`

```js
import axiosAPI from "../../services/axiosAPI/axiosInstance";
// consomation du API du backend
const userData = {user,pass}
const response = await axiosAPI.post('/users/register', userData);
```

### famma `axiosAPI.get()`, `axiosAPI.post()`, `axiosAPI.put()`, `axiosAPI.patch()` w `axiosAPI.delete()` zeda kifkif ye5dmou

## C.C
