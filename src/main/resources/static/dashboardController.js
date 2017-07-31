angular.module("serpring")
  .controller("dashboardController", function($scope, $http) {
    
    /**
	 * Bind com dados do usuário que será logado.
	 */
    $scope.userLogin = {};

    /**
	 * Bind com dados do usuário que está sendo cadastrado na aplicação.
	 */
    $scope.userSubscribe = {};

    /**
	 * Atributo contendo os dados de nome e email da sessão atual.
	 */
    $scope.currentSession = {};

    /**
	 * Bind contendo o nome da requisição para API do IMDB.
	 */
    $scope.searchInput;
    $scope.serieSearchObject = {};

    /**
	 * Lista com todos as séries encontradas pela API do IMDB.
	 */
    $scope.searchRequest = [];

    /**
	 * Sub-listas com as séries adicionadas ao perfil e a lista de desejo.
	 */
    $scope.profileWatchlist = [];
    $scope.profileWatching = [];

    /**
	 * Coleção com todas as séries do perfil, tanto do perfil quanto da
	 * watchlist
	 */
    $scope.collectionSeries = [];

    /**
	 * Status e mensagem padrão da aplicação
	 */
    $scope.info = { status: "info", text: "Você precisa estar logado para adicionar séries" };
    
    /**
	 * Constantes da IMDB API
	 */
    const IMDB_API_ARGS = "&type=series";
    const IMDB_API_APIKEY = "&apikey=93330d3c&";
    const IMDB_API_BASEURL = "https://omdbapi.com/?s=";
    const IMDB_API_BASEURLID = "https://omdbapi.com/?i=";
    
    /**
	 * Constantes da API da aplicação 'Serpring'
	 */
    // const APP_NAME = "https://serpring.herokuapp.com/";
    const APP_NAME = "http://localhost:8080/serpring/";

    /**
	 * Bateria de status que descrevem o comportamente atual da aplicação ao
	 * usuário.
	 * 
	 * Tem como propriedades o status da requisição e uma mensagem de retorno.
	 */
    $scope.statusSuccess = function(message) {
      $scope.info.status = "success";
      $scope.info.text = message;
    };

    $scope.statusInfo = function(message) {
      $scope.info.status = "info";
      $scope.info.text = message;
    };

    $scope.statusWarning = function(message) {
      $scope.info.status = "warning";
      $scope.info.text = message;
    };

    $scope.statusDanger = function(message) {
      $scope.info.status = "danger";
      $scope.info.text = message;
    };

    /**
	 * Cadastra novo usuário através da API e limpa os campos input para
	 * cadastro de novo usuário.
	 */
    $scope.addProfile = function(profile) {
      $http({method: 'POST', url: APP_NAME + '/user', data: $scope.userSubscribe})
      .then(function(response) {
        $scope.statusSuccess("Usuário cadastrado com sucesso");
        $scope.userSubscribe = {};
        console.log(response);
      })
      .catch(function(error) {
        $scope.statusDanger("Cadastro não autorizado, por favor confira seus dados");
        console.log(error);
      });
    };

    /**
	 * Faz requisição à API REST enviando dados de email e senha do usuário. Se
	 * o usuário existir será retornado os dados de usuário que serão capturados
	 * e encaminhados para o atributo 'currentSession', responsável por
	 * administrar a sessão atual.
	 * 
	 * Os campos de input para login são limpados para uso futuro.
	 * 
	 * Através do método 'buildSeriesListsFromProfile' é realizado uma nova
	 * consulta na API que retorna todas as séries do usuário em específico.
	 * Essa lista de retorno é subdividida em duas: séries cadastradas no perfil
	 * e outra na lista de desejo.
	 */
    $scope.login = function() {
      $http({method: 'POST', url: APP_NAME + '/login', data: $scope.userLogin})
      .then(function(response) {
        $scope.currentSession = response.data;
        $scope.userLogin = {};
        bootSerieCollection();
        $scope.statusSuccess("Bem vindo " + $scope.currentSession.name);
        console.log(response);
      }).catch(function(error) {
        $scope.statusDanger("Login não autorizado, por favor confira seus dados");
        console.log(error);
      });
    };

    /**
	 * Encerrar a sessão atual não interage com a API.
	 * 
	 * Apenas o atributo de sessão 'currentSession' é zerado e as sub-listas,
	 * retornando ao estado inicial da aplicação.
	 */
    $scope.logout = function(user) {
      if ($scope.currentSession != undefined) {
        $scope.statusSuccess("Até mais " + $scope.currentSession.name);
        $scope.currentSession = {};
        $scope.profileWatching = [];
        $scope.profileWatchlist = [];
      } else {
        $scope.statusDanger("Logout não autorizado");
      }
    };

    /**
	 * Adiciona série delegando para 'addSerie' com argumentos objeto Serie e
	 * booleano informando se deve ser adicionado no perfil ou na watchlist.
	 */
    $scope.addSerieToProfile = function(serie) {
      if ($scope.currentSession.email !== undefined) {
        addSerie(serie, "true");
        bootSerieCollection();
      } else {
        alert("Você precisa estar logado para adicionar séries");
      }
    };

    /**
	 * Remove série do banco de dados e remove série da coleção diretamente do
	 * front-end sem refazer o boot.
	 */
    $scope.removeSerieFromProfile = function (serie) {
      if (confirm('Você tem certeza que deseja remover "' + serie.title + '" do seu perfil?') === true) {
        deleteDB(serie);
        $scope.profileWatching.splice($scope.profileWatching.indexOf(serie), 1);
      }
    };

    /**
	 * Atualiza nota da série ao perfil e realiza boot da coleção de séries.
	 */
    $scope.addRatingToProfile = function (serie, rating) {
      serie.myRating = rating;
      putDB(serie);
    };

    /**
	 * Atualiza último episódio assistido e realiza boot da coleção de séries.
	 */
    $scope.addLastEpisodeToProfile = function (serie, episode) {
      serie.lastEpisodeWatched = episode;
      putDB(serie);
    };

    /**
	 * Adiciona série delegando para 'addSerie' com argumentos objeto Serie e
	 * booleano informando se deve ser adicionado no perfil ou na watchlist.
	 */
    $scope.addSerieToWatchlist = function(serie) {
      if ($scope.currentSession.email !== undefined) {
        addSerie(serie, "false");
        bootSerieCollection();
      } else {
        alert("Você precisa estar logado para adicionar séries");
      }
    };

    /**
	 * Remove série do banco de dados e remove série da coleção diretamente do
	 * front-end sem refazer o boot.
	 */
    $scope.removeSerieFromWatchlist = function (serie) {
      if (confirm('Você tem certeza que deseja remover "' + serie.title + '" da sua lista de desejos?') === true) {
        deleteDB(serie);
        $scope.profileWatchlist.splice($scope.profileWatchlist.indexOf(serie), 1);
      }
    };

    /**
	 * Altera status booleano 'inProfile' - que informa se a série está no
	 * perfil - atualiza no banco de dados e realiza boot da coleção de séries.
	 */
    $scope.moveSerieFromWatching = function (serie) {
      if (confirm('Você tem certeza que deseja mover "' + serie.title + '" para seu perfil?') === true) {
        serie.inProfile = "true";
        putDB(serie);
        bootSerieCollection();
      }
    };

    /**
	 * Se o campo de busca não estiver vazio, realiza busca na API do IMDB e
	 * retorna lista de séries correspondente a busca.
	 */
    $scope.searchSerieRequest = function () {
      if ($scope.searchInput.length > 0) {
        return $http
          .get(IMDB_API_BASEURL + $scope.searchInput + IMDB_API_ARGS + IMDB_API_APIKEY)
          .then(function (response) {
            $scope.searchRequest = response.data.Search;
            console.log(response.data.Search);
          }, function error (error) {
            console.log(error);
          });
      } else {
        alert("Busca inválida. Por favor digite um termo válido");
      }
    };

    /**
	 * Salva série no banco de dados.
	 * 
	 * Tem como argumento de entrada objeto JSON do tipo série.
	 * 
	 * É necessário traduzir o callback através do método 'serieObjectBuilder'
	 * da requisição na IMDB API antes de usar o método.
	 */
    var saveDB = function(serie) {
      $http({method: 'POST', url: APP_NAME + '/serie', data: serie})
      .then(function(response) {
        $scope.statusSuccess("A série foi adicionada com sucesso");
        console.log(response);
      }, function(error) {
        $scope.statusDanger("Esta série já está adicionada em seu perfil!");
        console.log(error);
      });
    };

    /**
	 * Salva série no banco de dados.
	 * 
	 * Tem como argumento de entrada objeto JSON do tipo série.
	 * 
	 * É necessário traduzir o callback através do método 'serieObjectBuilder'
	 * da requisição na IMDB API antes de usar o método.
	 */
    var putDB = function(serie) {
      $http({method: 'PUT', url: APP_NAME + '/serie/' + serie.id, data: serie})
      .then(function(response) {
        $scope.statusSuccess("A série foi atualizada com sucesso");
        console.log(response);
      }, function(error) {
        $scope.statusDanger("Problema ao tentar atualizar série!");
        console.log(error);
      });
    };

    /**
	 * Deleta série do banco de dados.
	 * 
	 * Tem como argumento de entrada objeto JSON do tipo série.
	 */
    var deleteDB = function(serie) {
      $http({method: 'DELETE', url: APP_NAME + '/serie/' + serie.id})
      .then(function(response) {
        $scope.statusSuccess("A série foi removida com sucesso");
        console.log(response);
      }, function(error) {
        $scope.statusDanger("Problema ao tentar remover a série!");
        console.log(error);
      });
    };

    /**
	 * Realiza consulta na API do IMDB pela id da série passada no argumento. O
	 * callback retorna um objeto série com todos os atributos.
	 * 
	 * Com sintaxe de atributos diferente da recebida pela API do Serpring, o
	 * método 'serieObjectBuilder' traduz os atributos para a sintaxe correta e
	 * retorna um novo objeto. Agora aceito pela API.
	 * 
	 * Como atributos satélites, passamos as informações de id do usuário e
	 * booleando true informando que a série será adicionada na sublista
	 * watching.
	 * 
	 * O objeto retornado é inserido no banco de dados através do método
	 * 'saveSerieOnDB' que consulta a API do Serpring e realiza a inserção. Em
	 * seguida é reconstruído as duas sub-listas do usuário através do método
	 * 'bootSerieCollection'.
	 */
    var addSerie = function(serie, booleanSerieInProfile) {
      $http({method: 'GET', url: IMDB_API_BASEURLID + serie.imdbID + IMDB_API_APIKEY})
      .then(function (response) {
        var newSerie = serieObjectBuilder(response, $scope.currentSession.id, booleanSerieInProfile);
        $scope.profileWatching.push(newSerie);
        saveDB(newSerie);
      })
      .catch(function(error) {
        console.log(error);
      });
    };

    /**
	 * Traduz dados recebidos do callback da IMDB API para aplicação Serpring.
	 * 
	 * Adiciona os dados: id do usuário e qual das sublistas a série será
	 * adicionada.
	 */
    var serieObjectBuilder = function(response, userId, booleanInProfile) {
        var objectSerie = {
          "userId": userId,
          "inProfile": booleanInProfile,
          "title": response.data.Title,
          "year": response.data.Year,
          "released": response.data.Released,
          "actors": response.data.Actors,
          "plot": response.data.Plot,
          "awards": response.data.Awards,
          "poster": response.data.Poster,
          "imdbRating": response.data.imdbRating,
          "imdbId": response.data.imdbID,
        };
        return objectSerie;
    };

    /**
	 * Sempre que o usuário logar ou for adicionado uma nova série ao perfil
	 * será realizado uma requisição na API do Serpring para sincronizar a
	 * coleção de séries presente no front-end.
	 */
    var bootSerieCollection = function() {
      $http({method: 'GET', url: APP_NAME + '/user/' + $scope.currentSession.id + '/series/'})
      .then(function(response) {
        $scope.collectionSeries = response.data;
        buildSeriesListsCollection();
        console.log($scope.collectionSeries);
      }).catch(function(error) {
        console.log(error);
      });
    };

    /**
	 * Constrói as duas sublistas de série no profile e da lista de desejo a
	 * partir da coleção de séries adquirida pelo método
	 * 'getAllSeriesFromProfile'. A divisão entre as duas listas será realizada
	 * pelo atributo 'inProfile' do que retorna um booleano se a série está no
	 * perfil ou na lista de desejo.
	 * 
	 * Utiliza listas auxiliares para resolver problema de elementos duplicados.
	 */
    var buildSeriesListsCollection = function() {
      var profileList = [];
      var watchList = [];
      console.log($scope.collectionSeries.length);
      for (var index = 0; index < $scope.collectionSeries.length; index++) {
        if ($scope.collectionSeries[index].inProfile === true) {
          profileList.push($scope.collectionSeries[index]);
        } else {
          watchList.push($scope.collectionSeries[index]);
        }
      }
      $scope.profileWatching = profileList;
      $scope.profileWatchlist = watchList;
    };

    /**
	 * Retorna booleano se existe um objeto no array passado como argumento.
	 */
    var containsInArray = function(array, serie) {
      for (var index = 0; index < array.length; index++) {
        if (array[index].imdbID === serie.imdbID) {
          return true;
        }
      }
      return false;
    }

});
