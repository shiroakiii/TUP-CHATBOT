class Chatbox {
    constructor() {
        this.args = {
            chatBox: document.querySelector('.chat-container'),
            sendButton: document.querySelector('#send-btn')
        }

        this.state = false;
        this.message = []
    }

    display() {
        const {chatBox, sendButton} = this.args;

        sendButton.addEventListener('click', () => this.onSendButton(chatBox))

        const node = chatBox.querySelector('input');
        node.addEventListener("keyup", ({key}) => {
            if (key == "Enter") {
                this.onSendButton(chatBox)
            }
        })
    }

    onSendButton(chatBox) {
        var textField = chatBox.querySelector('input');
        let text1 = textField.value
        if (text1 === "") {
            return;
        }

        let msg1 = { name: "User", message: text1 }
        this.message.push(msg1);

        fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            body: JSON.stringify({ message: text1 }),
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(r => r.json())
        .then( r => {
            let msg2 = { name: "Drea", message: r.answer };
            this.message.push(msg2);
            this.updateChatText(chatBox)
            textField.value = ''

        }).catch((error) => {
            console.error('Error:', error);
            this.updateChatText(chatBox)
            textField.value = ''
        });

    } 

    updateChatText(chatBox) {
        var html = '';
        this.message.forEach(function(item, index) {
            let icon = '';
            let message = item.message.split('\n').join('<br>'); // Replace newline characters with <br> tags
            if (item.name === "Drea")
            {
                html += '<div class="message_bot">'
                html += '<img src="/static/images/tupseeklogo.png" class="drea-icon flex_message">'
                html += '<div class="messages__item messages__item--visitor flex_message">' + message + '</div>'
                html += '</div>'
            }
            else
            {
                html += '<div class="messages__item messages__item--operator">' + message + '</div>'
            }
          });

        const chatmessage = chatBox.querySelector('#chat-box');
        chatmessage.innerHTML = html;
        chatmessage.scrollTop = chatmessage.scrollHeight;
    }
}


const chatbox = new Chatbox();
chatbox.display();