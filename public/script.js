window.addEventListener("load", function () {

    let chatWindow = document.getElementById('chat-window');
    let messageWindow = document.getElementById('message-window');
    let button = document.getElementsByTagName('button')[0];

    button.addEventListener('click', async function () {

        try {

            let message = messageWindow.value;

            messageWindow.value = "";
    
            let body = JSON.stringify({ data: message });
    
            let response = await fetch('/api/submit', {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: body
            });

            if (response.ok === false) {

                console.log("response.ok === false");
                
                throw(new Error(response.status));
            }
        }
        catch(e) {
            console.error(e);
        }

    });


    setInterval(async ()=>{

        let response = await fetch('/api/poll', {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Accept': 'application/json'
            }
        });

        let message = JSON.parse((await response.text()));

        message.forEach((x)=>{
            let div = document.createElement('div');
            div.innerText = x;
            chatWindow.appendChild(div);
        });

    }, 1000);

});
