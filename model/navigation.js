// Du navigation page 
    // home page
    $('#home').on('click',function(){
        console.log('Change to home page');
        view.setActiveScreen('welcomeScreen');
    });
    
    //  univesity page


    $('#scholarship').on('click',function(){
        view.setActiveScreen('scholarshipScreen')
    });

    $('#university').on('click',function(){
        console.log('Change to university page');
        view.setActiveScreen('universityScreen');
    });

    $('#about').on('click',function(){
        view.setActiveScreen('welcomeScreen');
        document.getElementById("about-section").scrollIntoView();
    })