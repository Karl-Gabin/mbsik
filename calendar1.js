

    $(function () {

        // alert(NewDiv.id)

        var timer = null
        var OldDiv = ""
        var newFrame = null
        var TimerRunning = false
        // ## PARAMETRE D'AFFICHAGE du CALENDRIER ## /
        //si enLigne est a true , le calendrier s'affiche sur une seule ligne,
        //sinon il prend la taille spécifié par défaut;
          
        var largeur = "200"
        var calendar_top = $('#exampleAge').outerHeight()
        var separateur = "/"
          
        /* ##################### CONFIGURATION ##################### */
          
        /* ##- INITIALISATION DES VARIABLES -##*/
        var calendrierSortie = ''
        //Date actuelle
        var today = ''
        //Mois actuel
        var current_month = ''
        //Année actuelle
        var currentYear = new Date()
        var current_year = ''
        //Année supérieure
        var most_year = currentYear.getFullYear() - 12
        //Année inférieure
        var less_year = currentYear.getFullYear() - 89
        //Jours actuel
        var current_day = ''
        // la date de l'input
        var inputDate = []
        //Nombres de jours depuis le début de la semaine
        var current_day_since_start_week = ''
        //On initialise le nom des mois et le nom des jours en VF
        var month_name = new Array('Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Decembre')
        var month_name_abr = new Array('Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jui', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Dec')
        var day_name = new Array('lu','ma','me','je','ve','sa','di')
        //permet de récupèrer l'input sur lequel on a clické et de le remplir avec la date formatée
        var myObjectClick = null
        //Classe qui sera détecté pour afficher le calendrier
        var classMove = "calendrier"
        //Variable permettant de savoir si on doit garder en mémoire le champs input clické
        var lastInput = null
        //Div du calendrier
        var div_calendar = ""
        var year, month, day = ""
        /* ##################### FIN DE LA CONFIGURATION ##################### */
          
        //########################## Fonction permettant de remplacer "document.getElementById"  ########################## //
        // function $(element){
        //     return document.getElementById(element)
        // }

        //Permet de faire glisser une div de la gauche vers la droite
        let SlideUp = function (bigMenu, smallMenu){
            //Si le timer n'est pas finit on détruit l'ancienne div
            if(parseInt($(bigMenu).css('left')) < 0){
                $(bigMenu).css('left', parseInt($(bigMenu).css('left')) + 10 + "px")
                $(smallMenu).css('left', parseInt($(smallMenu).css('left')) + 10 + "px")
                // alert($(bigMenu).attr('class'))
                timer = setTimeout(function () {
                    SlideUp($(bigMenu), $(smallMenu))
                },10)
                clearTimeout(timer)
                TimerRunning = false
                $(smallMenu).remove()
                // alert("timer up bien kill");
            }
        }
        
        //Permet de faire glisser une div de la droite vers la gauche
        let SlideDown = function (bigMenu, smallMenu){
            if(parseInt($(bigMenu).css('left')) > 0){
                $(bigMenu).css('left', parseInt($(bigMenu).css('left')) - 10 + "px")
                $(smallMenu).css('left', parseInt($(smallMenu).css('left')) - 10 + "px")
                timer = setTimeout(function () {
                    SlideUp($(bigMenu), $(smallMenu))
                },10)
                clearTimeout(timer)
                TimerRunning = false
                $(smallMenu).remove()
                //alert("timer up bien kill");
            }
        }
  
        //Création d'une nouvelle div contenant les jours du calendrier
        let CreateDivTempo = function (From){
            if(!TimerRunning){

            var DateTemp = new Date()
            IdTemp = DateTemp.getMilliseconds()

            var newDiv = document.createElement('DIV')
            newDiv.setAttribute('class', 'ListeDate')
            newDiv.setAttribute('id', IdTemp)
            // alert($(newDiv).attr('id'))
            //remplissage

            newDiv.append(CreateDayCalandar(year, month, day))
                  
            $('#content_Calendar').append(newDiv)
             
                if(From == "left"){
                    TimerRunning = true
                    $(newDiv).css('left', ('-' + largeur + 'px'))
                    SlideUp($(newDiv), OldDiv)
                }
                else if(From == "right"){
                    TimerRunning = true
                    $(newDiv).css('left', (largeur + 'px'))
                    SlideDown($(newDiv), OldDiv)
                }
                else{
                    ""
                    $(newDiv).css('left', (0 + 'px'))
                }
                $('#content_Calendar').css('height', ($(newDiv).offsetHeight + 'px'))
                $('#content_Calendar').css('z-index', ('200'))
                OldDiv = $(newDiv)
            }
        }
  
        //########################## FIN DES FONCTION LISTENER ########################## //
        /*Ajout du listener pour détecter le click sur l'élément et afficher le calendrier
        uniquement sur les textbox de class css date */
          
        //Fonction permettant d'initialiser les listeners
        let init_evenement = function (){
            //On commence par affecter une fonction à chaque évènement de la souris
            if(window.attachEvent){
                document.onmousedown = start
                document.onmouseup = drop
            }
            else{
                document.addEventListener("mousedown",start, false)
                document.addEventListener("mouseup",drop, false)
            }
        }

        //Fonction permettant de récupèrer l'objet sur lequel on a clické, et l'on récupère sa classe
        let start = function (e){
            //On initialise l'évènement s'il n'a aps été créé ( sous ie )
            if(!e){
                e = window.event
            }
            //Détection de l'élément sur lequel on a clické
            var monElement = null
            monElement = (e.target)? e.target:e.srcElement

            if(monElement != null && $(monElement).hasClass('calendrier') && monElement)
            {
                //On appel la fonction permettant de récupèrer la classe de l'objet et assigner les variables
                getClassDrag(monElement)
                 
                if(myObjectClick){
                    InitializeClendar(monElement)
                    lastInput = myObjectClick
                }
            }
        }

        let drop = function (){
            myObjectClick = null
        }

        //########################## Fonction permettant de récupèrer la liste des classes d'un objet ##########################//
        let getClassDrag = function (myObject){
            
            var x = $(myObject).attr('class')
            listeClass = x.split(' ')
            // alert($(listeClass)[0])
            //On parcours le tableau pour voir si l'objet est de type calendrier
            for(var i = 0 ; i < listeClass.length ; i++){
                if(listeClass[i] == classMove){
                    myObjectClick = myObject
                    break
                }
            }
        }

        //########################## A REVOIR ########################## //
        //########################## A REVOIR ########################## //
        
        //########################## Pour combler un bug d'ie 6 on masque les select ########################## //
        let masquerSelect = function (){
            var ua = navigator.userAgent.toLowerCase()
            var versionNav = parseFloat(ua.substring(ua.indexOf('msie ') + 5 ))
            var isIE        = ((ua.indexOf('msie') != -1) && (ua.indexOf('opera') == -1) && (ua.indexOf('webtv') == -1))
        
            if(isIE && (versionNav < 7)){
                    svn=document.getElementsByTagName("SELECT")
                    for (a=0;a<svn.length;a++){
                    svn[a].style.visibility="hidden"
                    }
            }
        }
        
        let montrerSelect = function () {
            var ua = navigator.userAgent.toLowerCase()
            var versionNav = parseFloat(ua.substring(ua.indexOf('msie ') + 5 ))
            var isIE        = ((ua.indexOf('msie') != -1) && (ua.indexOf('opera') == -1) && (ua.indexOf('webtv') == -1))
        
            if(isIE && (versionNav < 7)){
                    svn=document.getElementsByTagName("SELECT")
                    for (a=0;a<svn.length;a++){
                    svn[a].style.visibility="visible"
                    }
            }
        }
  
        let CreateFrame = function () {
            newFrame = document.createElement('iframe')
            newFrame.setAttribute('class', 'iframe')
            newFrame.frameBorder="0"
            div_calendar.append(newFrame)
            $(newFrame).css('height', (div_calendar.offsetHeight -10 + 'px'))
        }

        //######################## FONCTIONS PROPRE AU CALENDRIER ########################## //
        //Fonction permettant de passer a l'annee précédente
        let PreviousYear = function () {
          
            //On récupère l'annee actuelle puis on vérifit que l'on est pas en dessous de l'an 1930 :-)
            if(current_year <= less_year){
                current_year = current_year
            } else {
                current_year = current_year - 1
            }
            //et on appel la fonction de génération de calendrier
            CreateDivTempo('left')
            //calendrier(   current_year , current_month, current_day);
        }
        
        //Fonction permettant de passer à l'annee suivante
        let NextYear = function () {
            
            //On récupère l'annee actuelle puis on vérifit que l'on est pas au dessus de 2008 :-)
            if(current_year >= most_year){
                current_year = current_year
            } else {
                current_year = current_year + 1
            }
            //et on appel la fonction de génération de calendrier
            //calendrier(   current_year , current_month, current_day);
            CreateDivTempo('right')
        }

        //Fonction permettant de passer au mois précédent
        let PreviousMonth = function () {
          
            //On récupère le mois actuel puis on vérifit que l'on est pas en janvier sinon on enlève une année
            if(current_month == 0){
                //On vérifit que l'on est pas en dessous de l'an 1930 :-)
                if(current_year <= less_year){
                    current_month = current_month
                    current_year = current_year
                } else {
                    current_month = 11
                    current_year = current_year - 1
                }
            } else {
                current_month = current_month - 1
            }
            //et on appel la fonction de génération de calendrier
            CreateDivTempo('left')
            //calendrier(   current_year , current_month, current_day);
        }
        
        //Fonction permettant de passer au mois suivant
        let NextMonth = function () {
            //On récupère le mois actuel puis on vérifit que l'on est pas en janvier sinon on ajoute une année
            if (current_month == 11) {
                //On vérifit que l'on est pas au dessus de 2008 :-)
                if (current_year >= most_year) {
                    current_month = current_month
                    current_year = current_year
                } else {
                    current_month = 0
                    current_year = current_year + 1
                }
            } else {
                current_month = current_month + 1
            }
            //et on appel la fonction de génération de calendrier
            //calendrier(   current_year , current_month, current_day)
            CreateDivTempo('right')
        }
  
        //Fonction principale qui génère le calendrier
        //Elle prend en paramètre, l'année , le mois , et le jour
        //Si l'année et le mois ne sont pas renseignés , la date courante est affecté par défaut
        let Calendar = function (year, month, day) {
            
            // alert($(myObjectClick).attr('id'))
            var elt = $('#exampleDateNais')
            $(elt).keydown(function () {
            }).keyup(function () {
                DropOut()
            })
            
            //Aujourd'hui si month et year ne sont pas renseignés
            if (month == null || year == null) {
                today = new Date()
                //Année supérieure
                current_year = most_year

            } else {
                //Création d'une date en fonction de celle passée en paramètre
                today = new Date(year, month , day)
                //Année supérieure
                current_year = today.getFullYear()

            }

            //Mois actuel
            current_month = today.getMonth()
            //Jours actuel
            current_day = today.getDate()
             
            //######################## ENTETE ########################//
            // Ligne permettant de changer l'année et de mois

            // on créé le titre contenant les infos sur l'année et le mois
            var calendarTitle = document.createElement('div')
            calendarTitle.setAttribute('class', 'calendar_title')
            
            // on créé le div contenant l'année
            var year_div = document.createElement('div')
            $(year_div).addClass('title-child row row-betw')
            var year_content = document.createElement('span')
            year_content.setAttribute('id', 'curentDateString')
            var year_bef = document.createElement('div')
            year_bef.setAttribute('class', 'calendar_button')
            year_bef.setAttribute('id', 'year_bef')
            var year_next = document.createElement('div')
            year_next.setAttribute('class', 'calendar_button')
            year_next.setAttribute('id', 'year_next')
            year_content.append(current_year)
            year_bef.append(current_year - 1)
            year_next.append(current_year + 1)

            $(year_div).append(year_bef).append(year_content).append(year_next)
            $(calendarTitle).append(year_div)
            
            $(year_bef).mousedown(function () {
            }).mouseup(function () {
                PreviousYear()
                $(year_content).empty()
                $(year_bef).empty()
                $(year_next).empty()
                year_content.append(current_year)
                year_bef.append(current_year - 1)
                year_next.append(current_year + 1)
                // alert($('.currentDay').attr('class'))
                $(lastInput).val(formatInfZero($('.currentDay').text()) + separateur + formatInfZero((current_month + 1)) + separateur + current_year)
            })
            
            $(year_next).mousedown(function () {
            }).mouseup(function () {
                NextYear()
                $(year_content).empty()
                $(year_bef).empty()
                $(year_next).empty()
                year_content.append(current_year)
                year_bef.append(current_year - 1)
                year_next.append(current_year + 1)
                $(lastInput).val(formatInfZero($('.currentDay').text()) + separateur + formatInfZero((current_month + 1)) + separateur + current_year)
            })

            
            // on créé le div contenant le mois
            var month_div = document.createElement('div')
            month_div.setAttribute('class', 'title-child row row-betw')
            var month_content = document.createElement('span')
            month_content.setAttribute('id', 'curentMonthString')
            month_content.append(month_name[current_month])
            var month_bef = document.createElement('div')
            month_bef.setAttribute('class', 'calendar_button')
            month_bef.setAttribute('id', 'month_bef')
            month_bef.append(month_name_abr[current_month - 1])
            var month_next = document.createElement('div')
            month_next.setAttribute('class', 'calendar_button')
            month_next.setAttribute('id', 'month_next')
            month_next.append(month_name_abr[current_month + 1])

            $(month_div).append(month_bef).append(month_content).append(month_next)
            $(calendarTitle).append(month_div)
            
            $(month_bef).mousedown(function () {
            }).mouseup(function () {
                PreviousMonth()
                $(month_content).empty()
                $(month_bef).empty()
                $(month_next).empty()
                month_content.append(month_name[current_month])
                if (current_month == 0) {
                    month_bef.append(month_name_abr[11])
                    month_next.append(month_name_abr[current_month + 1])
                } else if (current_month == 11) {
                    month_next.append(month_name_abr[0])
                    month_bef.append(month_name_abr[current_month - 1])
                }
                else {
                    month_bef.append(month_name_abr[current_month - 1])
                    month_next.append(month_name_abr[current_month + 1])
                }
                $(year_content).empty()
                $(year_bef).empty()
                $(year_next).empty()
                year_content.append(current_year)
                year_bef.append(current_year - 1)
                year_next.append(current_year + 1)
                $(lastInput).val(formatInfZero($('.currentDay').text()) + separateur + formatInfZero((current_month + 1)) + separateur + current_year)
            })
            
            $(month_next).mousedown(function () {
            }).mouseup(function () {
                NextMonth()
                $(month_content).empty()
                $(month_bef).empty()
                $(month_next).empty()
                month_content.append(month_name[current_month])
                if (current_month == 0) {
                    month_bef.append(month_name_abr[11])
                    month_next.append(month_name_abr[current_month + 1])
                } else if (current_month == 11) {
                    month_next.append(month_name_abr[0])
                    month_bef.append(month_name_abr[current_month - 1])
                }
                else {
                    month_bef.append(month_name_abr[current_month - 1])
                    month_next.append(month_name_abr[current_month + 1])
                }
                $(year_content).empty()
                $(year_bef).empty()
                $(year_next).empty()
                year_content.append(current_year)
                year_bef.append(current_year - 1)
                year_next.append(current_year + 1)
                $(lastInput).val(formatInfZero($('.currentDay').text()) + separateur + formatInfZero((current_month + 1)) + separateur + current_year)
            })
            
            
            
            calendrierSortie = "<div class=\"titleMonth\"><span> &copy; mbsik.com</span></div>"
            //On affiche le mois et l'année en titre
            calendrierSortie += "<div id=\"content_Calendar\">"
            //######################## FIN ENTETE ########################//
             
            //Si aucun calendrier n'a encore été crée :
            if ($('#calendar')) {
                div_calendar = $('#calendar')
            } else {
                //On crée une div dynamiquement, en absolute, positionné sous le champs input
                div_calendar = document.createElement('div')
                 
                //On définit les attributs de cette div ( id et classe )
                div_calendar.setAttribute('id', 'calendar')
                div_calendar.setAttribute('class', 'calendar')
                 
                //Pour ajouter la div dans le document
                var calendarParent = $('#calendar_div')
                 
                //Pour finir on ajoute la div dans le document
                calendarParent.append(div_calendar)
            }
             
            //On insèrer dans la div, le contenu du calendrier généré
            //On assigne la taille du calendrier de façon dynamique ( on ajoute 10 px pour combler un bug sous ie )
            var width_calendar = largeur + 'px'
            //Ajout des éléments dans le calendrier
            calendrierSortie = calendrierSortie + "</div><div class=\"separator\"></div>"
            $(div_calendar).append(calendarTitle)
            $(div_calendar).append(calendrierSortie)
            $(div_calendar).css('width', width_calendar).css('top', (calendar_top + 'px'))
            //On remplit le calendrier avec les jours
            CreateDivTempo('')
        }

        let CreateDayCalandar = function (){
             
            // On récupère le premier jour de la semaine du mois
            var dateTemp = new Date(current_year, current_month, 1)
             
            //test pour vérifier quel jour était le premier du mois
            current_day_since_start_week = (( dateTemp.getDay()== 0 ) ? 6 : dateTemp.getDay() - 1)
             
            //variable permettant de vérifier si l'on est déja rentré dans la condition pour éviter une boucle infinit
            var verifJour = false
             
            //On initialise le nombre de jour par mois
            var febNumDay = (current_year % 4) == 0 ? 29 : 28
            //Initialisation du tableau indiquant le nombre de jours par mois
            var day_number = new Array(31,febNumDay,31,30,31,30,31,31,30,31,30,31)
             
            var x = 0
             
            //On initialise la ligne qui comportera tous les noms des jours depuis le début du mois
            var list_day = document.createElement('div')
            $(list_day).addClass('list_day row')
            var day_calendar = document.createElement('div')
            $(day_calendar).addClass('day_calendar row wrap')
            //On remplit le calendrier avec le nombre de jour, en remplissant les premiers jours par des champs vides
            for(var nbjours = 0 ; nbjours < (day_number[current_month] + current_day_since_start_week) ; nbjours++){
                 
                // On boucle tous les 7 jours pour créer la ligne qui comportera le nom des jours en fonction des<br />
                // paramètres d'affichage
                if(verifJour == false){
                    for(x = 0 ; x < 7 ; x++){
                        if(x == 6){
                            var calendarDay = document.createElement('span')
                            calendarDay.setAttribute('class', 'calendarDay')
                            $(calendarDay).append(day_name[x])
                            $(list_day).append(calendarDay)
                        }
                        else{
                            var calendarDay = document.createElement('span')
                            calendarDay.setAttribute('class', 'calendarDay')
                            $(calendarDay).append(day_name[x])
                            $(list_day).append(calendarDay)
                        }
                    }
                    verifJour = true
                }
                //et enfin on ajoute les dates au calendrier
                //Pour gèrer les jours "vide" et éviter de faire une boucle on vérifit que le nombre de jours corespond bien au
                //nombre de jour du mois
                if(nbjours < day_number[current_month]){
                    var dayDate = document.createElement('span')
                    if(current_day == (nbjours + 1)){
                        $(dayDate).addClass('DayDate currentDay')
                    }
                    else{
                        $(dayDate).addClass('DayDate')
                    }
                    $(dayDate).append(nbjours + 1)
                    $(day_calendar).append(dayDate)
                    $(dayDate).mousedown(function () {
                    }).mouseup(function () {
                        // alert($(this).text())
                        SetDateInInput($(this).text())
                    })
        
                }
            }
          
            //On ajoute les jours "vide" du début du mois
            for(i  = 0 ; i < current_day_since_start_week ; i ++){
                $(day_calendar).prepend("<span>&nbsp;</span>")
            }

            var divInside = document.createElement('div')
            $(divInside).addClass('divInside')

            //On met également a jour le mois et l'année
            $(divInside).append(list_day)
            // alert($('.ListeDate').attr('class'))
            $(divInside).append(day_calendar)
            return divInside
        }
  
        let InitializeClendar = function (objetClick){
                //on affecte la variable définissant sur quel input on a clické
                myObjectClick = objetClick
                $('#calendar').empty()
                // alert($(myObjectClick).attr('id'))
                 
                if(myObjectClick.disabled != true){
                    //On vérifit que le champs n'est pas déja remplit, sinon on va se positionner sur la date du champs
                    if($(myObjectClick).val() != ''){
                        //On utilise la chaine de separateur
                            var reg = new RegExp("/", "g")
                            var limit = most_year
                            var dateDuChamps = $(myObjectClick).val()
                            var tableau = dateDuChamps.split(reg)
                            if (tableau[2] < less_year || tableau[2] > limit) {
                                Calendar( limit, parseInt(tableau[1] - 1), parseInt(tableau[0]))
                            }
                            // alert($(tableau)[2] + '-' +  (parseInt(tableau[1] - 1)) + '-' + parseInt(tableau[0]))
                            else Calendar( tableau[2], parseInt(tableau[1] - 1), parseInt(tableau[0]))
                    }
                    else{
                        //on créer le calendrier
                        Calendar(objetClick)
                    }
                    //puis on le positionne par rapport a l'objet sur lequel on a clické
                    Dropdown(calendar)
                    CreateFrame();
                }
          
        }

        //Fonction permettant d'alimenter le champs
        let SetDateInInput = function (daySelect){
            if(daySelect != ''){
                $(lastInput).val(formatInfZero(daySelect) + separateur + formatInfZero((current_month +1 )) + separateur + current_year)
                } else {
                    lastInput.val('')
                }
                HideCalendar()
        }

         let HideCalendar =function (){
            DropOut()
            //On Masque la frame /!\
            $(newFrame).css('display', 'none')
        }
          
        let formatInfZero = function (numberFormat){
                if(parseInt(numberFormat) < 10){
                        numberFormat = '0' + numberFormat
                }
                return numberFormat
        }

        //######################## FONCTION PERMETTANT D'AFFICHER LE CALENDRIER DE FACON PROGRESSIVE ########################//
        
        let Dropdown = function (){
            
            var clickedElt = $(myObjectClick)
            if ($(clickedElt).hasClass('calendrier')) {
                var clickedEltParent = $(clickedElt).parent()
                var dropElt = $('#calendar')
                
                $(dropElt).hide().removeClass('Drop') // masque #ma_div en fondu
                $(clickedEltParent).attr('aria-expanded', 'false')
                setTimeout(function () {
                    if ($(clickedEltParent).attr('aria-expanded') == 'false') {
                        $(dropElt).fadeIn(200).addClass('Drop')
                        $(clickedEltParent).attr('aria-expanded', 'true')
                    }
                }, 100)
            }

            $(document.body).click(function(e) {
                if ($(clickedEltParent).attr('aria-expanded') == 'true') {
                
                    // Si ce n'est pas #calendar ni un de ses enfants
                    if( !$(e.target).is(dropElt) && !$.contains($(dropElt)[0],e.target) ) {
                        if( !$(e.target).is(clickedElt) && !$.contains($(clickedElt)[0],e.target) ) {
                            $(dropElt).empty().hide().removeClass('Drop')
                            $(clickedEltParent).attr('aria-expanded', 'false')
                        }
                    }
                
                }
            })
        }

        let DropOut = function () {
        
            var clickedElt = $(lastInput)
            // alert($(clickedElt).attr('id'))
            if ($(clickedElt).hasClass('calendrier')) {
                var clickedEltParent = $(clickedElt).parent()
                var dropElt = $('#calendar')

                if ($(clickedEltParent).attr('aria-expanded') == 'true') {
                
                    $(dropElt).empty().fadeOut(300).removeClass('Drop')
                    $(clickedEltParent).attr('aria-expanded', 'false')
                
                }
            }
        }
          
        $(window).ready(function () {
            init_evenement()
        })
        
        // var input = $('#exampleAge')
        
        // if (input.val() != '#exampleAge') input.val('#exampleAge')
        
    })
