

function htmlRenderAllTasks(currentTask, i) {
    return /*html*/ `
            <div status="closed" id="${i}" class="board-content" onclick="loadCard(${i})" draggable="true" ondragstart="dragstart_handler(${i})" ondragend="removeTest(${i})" ontouchstart="touchStart(${i})" ontouchend="touchEnd(${i})">
            <div class="task-category ${currentTask.category}">${currentTask.category}</div>
            <div class="task-title">${currentTask.title}</div>
            <div class="task-description">${currentTask.description}</div>
            <div class="subtask-progress-bar-container">
                <div class="subtask-progress-bar" id="subtask-progress-bar-${i}"></div>
                <div  id="subtask-counter-${i}"></div>
            </div>
            <div class="prio-and-contact-container">
                <div class="contact-selection" id="contact-selection-${currentTask.status}_${i}"></div>
                <div id="${currentTask.prio}_${i}"></div>
            </div>
                <img id="delete" onclick="stopPropagation(event);deleteTask(${i})" src="./assets/img/delete.svg" alt="delete"></div>
            </div>        
        `
}


function htmlRenderCard(i) {
    return  /*html*/ `
    <div id="card-container" class="d-none" onclick="stopPropagation(event)">
        <div class="card-close-icon-container">
            <svg id="cross-svg" width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg" onclick="closeCard()">
                <path d="M22.9614 7.65381L7.65367 22.9616" stroke="#2A3647" stroke-width="2" stroke-linecap="round"/>
                <path d="M22.8169 23.106L7.50914 7.7982" stroke="#2A3647" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <div>   
                <svg id="arrow-svg" class="d-none" width="25" height="23" viewBox="0 0 25 23" fill="none" xmlns="http://www.w3.org/2000/svg" onclick="closeCard()">
                <path d="M6.06825 9.95833H23.2917C24.1432 9.95833 24.8334 10.6486 24.8334 11.5C24.8334 12.3514 24.1432 13.0417 23.2917 13.0417H6.06825L13.2478 20.2212C13.8498 20.8232 13.8498 21.7992 13.2478 22.4011C12.6458 23.0031 11.6698 23.0031 11.0679 22.4011L1.58096 12.9142C0.799914 12.1332 0.799913 10.8668 1.58096 10.0858L11.0679 0.59887C11.6698 -0.00309756 12.6458 -0.00309813 13.2478 0.598869C13.8498 1.20084 13.8498 2.17682 13.2478 2.77879L6.06825 9.95833Z" fill="black"/>
                </svg>
            </div>
        </div>
        <div class="card-units task-category ${tasks[i].category}" style="font-size: 27px;">${tasks[i].category}</div>
        <div class="card-units card-title">${tasks[i].title}</div>
        <div class="card-units card-description">${tasks[i].description}</div>
        <div class="card-units card-date-container">
            <p>Due date:</p>
            <p>${tasks[i].date}</p>
        </div>
        <div class="card-units card-prio-container">
            <p>Priority:</p>
            <p class="card-prio" id="card-${tasks[i].prio}">${tasks[i].prio}</p>
        </div>
        <div class="card-units">
            <p style="font-weight: 700; font-size: 21px">Assigned to:</p>
            <div id="contact-card-container"></div>
        </div>
        <div class="edit-task-container">
            <div onclick="loadEditTask(${i})">
                <svg width="21" height="31" viewBox="0 0 21 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.94494 22.5155L7.76427 25.4404L20.4074 4.60829C20.694 4.13616 20.5435 3.52113 20.0714 3.23459L16.9618 1.34736C16.4897 1.06082 15.8746 1.21127 15.5881 1.6834L2.94494 22.5155Z" fill="white"/>
                <path d="M2.35987 23.4792L7.1792 26.4041L2.45058 28.6889L2.35987 23.4792Z" fill="white"/>
                </svg>
            </div>
        </div>
    </div>
`
}


function htmlRenderEditTask(i) {
    return /*html*/ `
    <div class="edit-task-card">
        <div></div>
        <form class="edit-task-form"; onsubmit="closeForm(${i}); return false ;">
            <div>
                <p>Title</p>
                <input type="text" value="${tasks[i].title}" id="edit-task-title" required >
            </div>
            <div>
                <p>Description</p>
                <input type="textarea" value="${tasks[i].description}" id="edit-task-description" required>
            </div>
            <div id="edit-task-subtasks-container">
            </div>
            <div class="edit-task-date-container">
                <p>Due Date</p>
                <input type="text" value="${tasks[i].date}" onfocus="(this.type='date'); hideIcon()" onblur="(this.type='text'); hideIcon()" id="edit-task-date">
                <div id="edit-task-date-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.8334 2.49984H22.3335C22.6429 2.49984 22.9397 2.62275 23.1584 2.84155C23.3772 3.06034 23.5002 3.35708 23.5002 3.6665V22.3332C23.5002 22.6426 23.3772 22.9393 23.1584 23.1581C22.9397 23.3769 22.6429 23.4998 22.3335 23.4998H1.66667C1.35725 23.4998 1.0605 23.3769 0.841709 23.1581C0.622916 22.9393 0.5 22.6426 0.5 22.3332V3.6665C0.5 3.35708 0.622916 3.06034 0.841709 2.84155C1.0605 2.62275 1.35725 2.49984 1.66667 2.49984H6.16674V1.1665C6.16674 0.614219 6.61446 0.166504 7.16674 0.166504H7.50008C8.05236 0.166504 8.50007 0.614219 8.50007 1.1665V2.49984H15.5001V1.1665C15.5001 0.614219 15.9478 0.166504 16.5001 0.166504H16.8334C17.3857 0.166504 17.8334 0.614219 17.8334 1.1665V2.49984ZM2.50016 8.99984V21.4998H21.5002V8.99984H2.50016ZM5.00005 15.1665C5.00006 14.6142 5.44778 14.1665 6.00005 14.1665H9.83341C10.3857 14.1665 10.8334 14.6142 10.8334 15.1665V16.4998C10.8334 17.0521 10.3857 17.4998 9.83341 17.4998H6.00002C5.44773 17.4998 5.00001 17.0521 5.00002 16.4998L5.00005 15.1665Z" fill="black"/>
                    </svg>
                </div>
            </div>
            <div>
                <p>Prio</p>
                <div class="edit-task-prio-container" >
                    <div id="prio-area-urgent" onclick="changePrio(${i}, 'urgent')">
                    <p>Urgent</p>
                        <svg width="20" height="15" viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_39163_1044)">
                                <path d="M18.9043 14.7547C18.6696 14.7551 18.4411 14.6803 18.2522 14.5412L10.0001 8.458L1.74809 14.5412C1.63224 14.6267 1.50066 14.6887 1.36086 14.7234C1.22106 14.7582 1.07577 14.7651 0.933305 14.7437C0.790837 14.7223 0.653973 14.6732 0.530528 14.599C0.407083 14.5247 0.299474 14.427 0.213845 14.3112C0.128216 14.1954 0.0662437 14.0639 0.0314671 13.9243C-0.00330956 13.7846 -0.0102098 13.6394 0.0111604 13.497C0.0543195 13.2095 0.21001 12.9509 0.443982 12.7781L9.34809 6.20761C9.53679 6.06802 9.76536 5.99268 10.0001 5.99268C10.2349 5.99268 10.4635 6.06802 10.6522 6.20761L19.5563 12.7781C19.7422 12.915 19.8801 13.1071 19.9503 13.327C20.0204 13.5469 20.0193 13.7833 19.9469 14.0025C19.8746 14.2216 19.7349 14.4124 19.5476 14.5475C19.3604 14.6826 19.1352 14.7551 18.9043 14.7547Z" fill="#FF3D00"/>
                                <path d="M18.9043 9.00568C18.6696 9.00609 18.4411 8.93124 18.2522 8.79214L10.0002 2.70898L1.7481 8.79214C1.51412 8.96495 1.22104 9.0378 0.93331 8.99468C0.645583 8.95155 0.386785 8.79597 0.213849 8.56218C0.0409137 8.32838 -0.0319941 8.03551 0.011165 7.74799C0.054324 7.46048 0.210015 7.20187 0.443986 7.02906L9.3481 0.458588C9.5368 0.318997 9.76537 0.243652 10.0002 0.243652C10.2349 0.243652 10.4635 0.318997 10.6522 0.458588L19.5563 7.02906C19.7422 7.16598 19.8801 7.35809 19.9503 7.57797C20.0204 7.79785 20.0193 8.03426 19.947 8.25344C19.8746 8.47262 19.7349 8.66338 19.5476 8.79847C19.3604 8.93356 19.1352 9.00608 18.9043 9.00568Z" fill="#FF3D00"/>
                            </g>
                            <defs>
                                <clipPath id="clip0_39163_1044">
                                    <rect width="20" height="14.5098" fill="white" transform="translate(0 0.245117)"/>
                                </clipPath>
                            </defs>
                        </svg>
                    </div>
                    <div id="prio-area-medium" onclick="changePrio(${i}, 'medium')">
                    <p>Medium</p>
                        <svg width="20" height="9" viewBox="0 0 20 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_39163_1051)">
                                <path d="M18.9041 8.22528H1.09589C0.805242 8.22528 0.526498 8.10898 0.320979 7.90197C0.11546 7.69495 0 7.41419 0 7.12143C0 6.82867 0.11546 6.5479 0.320979 6.34089C0.526498 6.13388 0.805242 6.01758 1.09589 6.01758H18.9041C19.1948 6.01758 19.4735 6.13388 19.679 6.34089C19.8845 6.5479 20 6.82867 20 7.12143C20 7.41419 19.8845 7.69495 19.679 7.90197C19.4735 8.10898 19.1948 8.22528 18.9041 8.22528Z" fill="#FFA800"/>
                                <path d="M18.9041 2.98211H1.09589C0.805242 2.98211 0.526498 2.86581 0.320979 2.6588C0.11546 2.45179 0 2.17102 0 1.87826C0 1.5855 0.11546 1.30474 0.320979 1.09772C0.526498 0.890712 0.805242 0.774414 1.09589 0.774414L18.9041 0.774414C19.1948 0.774414 19.4735 0.890712 19.679 1.09772C19.8845 1.30474 20 1.5855 20 1.87826C20 2.17102 19.8845 2.45179 19.679 2.6588C19.4735 2.86581 19.1948 2.98211 18.9041 2.98211Z" fill="#FFA800"/>
                            </g>
                            <defs>
                                <clipPath id="clip0_39163_1051">
                                    <rect width="20" height="7.45098" fill="white" transform="translate(0 0.774414)"/>
                                </clipPath>
                            </defs>
                        </svg>

                    </div>
                    <div id="prio-area-low" onclick="changePrio(${i}, 'low')">
                    <p>Low</p>
                        <svg width="20" height="15" viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 9.00614C9.7654 9.00654 9.53687 8.9317 9.34802 8.79262L0.444913 2.22288C0.329075 2.13733 0.231235 2.02981 0.15698 1.90647C0.0827245 1.78313 0.033508 1.64638 0.0121402 1.50404C-0.031014 1.21655 0.0418855 0.923717 0.214802 0.689945C0.387718 0.456173 0.646486 0.300615 0.934181 0.257493C1.22188 0.21437 1.51493 0.287216 1.74888 0.460004L10 6.54248L18.2511 0.460004C18.367 0.374448 18.4985 0.312529 18.6383 0.277782C18.7781 0.243035 18.9234 0.236141 19.0658 0.257493C19.2083 0.278844 19.3451 0.328025 19.4685 0.402225C19.592 0.476425 19.6996 0.574193 19.7852 0.689945C19.8708 0.805697 19.9328 0.937168 19.9676 1.07685C20.0023 1.21653 20.0092 1.36169 19.9879 1.50404C19.9665 1.64638 19.9173 1.78313 19.843 1.90647C19.7688 2.02981 19.6709 2.13733 19.5551 2.22288L10.652 8.79262C10.4631 8.9317 10.2346 9.00654 10 9.00614Z" fill="#7AE229"/>
                            <path d="M10 14.7547C9.7654 14.7551 9.53687 14.6802 9.34802 14.5412L0.444913 7.97142C0.210967 7.79863 0.0552944 7.54005 0.0121402 7.25257C-0.031014 6.96509 0.0418855 6.67225 0.214802 6.43848C0.387718 6.20471 0.646486 6.04915 0.934181 6.00603C1.22188 5.96291 1.51493 6.03575 1.74888 6.20854L10 12.291L18.2511 6.20854C18.4851 6.03575 18.7781 5.96291 19.0658 6.00603C19.3535 6.04915 19.6123 6.20471 19.7852 6.43848C19.9581 6.67225 20.031 6.96509 19.9879 7.25257C19.9447 7.54005 19.789 7.79863 19.5551 7.97142L10.652 14.5412C10.4631 14.6802 10.2346 14.7551 10 14.7547Z" fill="#7AE229"/>
                        </svg>
                    </div>
                </div>
            </div>
            <div>
                <p>Assigned to</p>
              
                <div id="contactShow" class="dropdownB">
                    <div onclick="dropdownB('contact', ${i})" class="flex gap-10" id="selectContact">
                        Select contacts to assign
                    </div>
                    <div id="contact" class="flex-column d-none">
                    </div>
                        <img class="arrow" id="arrowContact" src="./assets/img/arrow-down.svg">
                </div>
          
            </div>
            <div id="contact-card-container" class="${i}">
            </div>
            <div class="edit-task-btn-container">
            <button id="edit-task-btn">
                <p>OK</p>
                <svg width="18" height="15" viewBox="0 0 18 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 7.5L7 13.5L17 1.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
            </div>
        </form>
    </div>
    `
}


function renderInviteNewContactArea(i) {
    return /*html*/ `
    <div class="invite-contact-container">
        <input class="invite-contact-input" type="email" placeholder="Contact email">
        <div>
            <div>
                <svg width="26" height="26" viewBox="2 2 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" onclick="closeCard()">
                    <path d="M22.9614 7.65381L7.65367 22.9616" stroke="#2A3647" stroke-width="2" stroke-linecap="round"/>
                    <path d="M22.8169 23.106L7.50914 7.7982" stroke="#2A3647" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </div>
            <div>
                <svg width="2" height="31" viewBox="0 0 2 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 0V31" stroke="#D1D1D1"/>
                </svg>
            </div>
            <div onclick="showDropDownB(${i})">
                <svg width="18" height="18" viewBox="0 -2 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 7.5L7 13.5L17 1.5" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
        </div>
    </div>
    `
}


function renderAddTaskFromBoard() {
    return /*html*/ `
    <div class="add-task-byboard-container slide-inA container-color-grey" id="add-task-byboard-container" onclick="stopPropagation(event)">
    <div class="card-close-icon-container-edit-task">
        <div onclick="closeEditTaskOnBoard()">
            <img src="./assets/img/card-container-close-icon.svg">
        </div>
        </div>
        <div class="content-add-task">
        <div class="background" onclick="dropup('category'); dropup('contact')">
            </div>
            <div>
                <div>
                    <h1>Add Task</h1>
                    <div id="errorTask"></div>
                </div>
                <form class="flex-column newGap0" onsubmit="readForm(); return false;">
                    <div class="flex mobile-flex-column span-margin newGap0">
                        <div class="flex-column left-side newWidth">
                            <span>Title</span>
                            <input required placeholder="Enter a title" id="title" type="text">
                            <span>Description</span>
                            <textarea required placeholder="Enter a Description" id="description"></textarea>
                            <span>Category</span>
                            <div id="newCategoryInput" class="d-none">
                                <div class="flex-column gap-10">
                                    <input placeholder="New category name" type="text" id="newCategory">
                                    <div class="confirmAndCancel">
                                        <img onclick="closeNewCategoryInput()" src="./assets/img/x.svg">
                                        <img onclick="addNewCategory()" src="./assets/img/confirm.svg">
                                    </div>
                                    <div id="categoryColors" class="flex gap-10">

                                    </div>
                                </div>
                            </div>

                            <div id="categoryShow" class="dropdown">
                                <div onclick="dropdown('category')" class="flex gap-10" id="selectCategory">Select task
                                    category</div>
                                <div id="category" class="flex-column d-none">
                                </div>
                                <img class="arrow" onclick="dropdown('category')" id="arrowCategory" src="./assets/img/arrow-down.svg">
                            </div>
                            <span>Assigned to</span>
                            <div id="contactShow" class="dropdown">
                                <div onclick="dropdown('contact')" class="flex gap-10" id="selectContact">
                                    Select contacts to assign
                                </div>
                                <div id="contact" class="flex-column d-none">
                                </div>
                                <img class="arrow" onclick="dropdown('contact')" id="arrowContact" src="./assets/img/arrow-down.svg">
                            </div>
                        </div>
                        <div class="flex-column right-side newWidth newGap">
                            <span>Due Date</span>
                            <input required id="date" type="date">
                            <span>Prio</span>
                            <div class="flex gap-10">
                                <button class="prio-btn" id="urgent" type="button" onclick="setprio('urgent')">
                                    Urgent
                                    <svg width="20" height="15" viewBox="0 0 20 15" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <g clip-path="url(#clip0_39163_1044)">
                                            <path
                                                d="M18.9043 14.7547C18.6696 14.7551 18.4411 14.6803 18.2522 14.5412L10.0001 8.458L1.74809 14.5412C1.63224 14.6267 1.50066 14.6887 1.36086 14.7234C1.22106 14.7582 1.07577 14.7651 0.933305 14.7437C0.790837 14.7223 0.653973 14.6732 0.530528 14.599C0.407083 14.5247 0.299474 14.427 0.213845 14.3112C0.128216 14.1954 0.0662437 14.0639 0.0314671 13.9243C-0.00330956 13.7846 -0.0102098 13.6394 0.0111604 13.497C0.0543195 13.2095 0.21001 12.9509 0.443982 12.7781L9.34809 6.20761C9.53679 6.06802 9.76536 5.99268 10.0001 5.99268C10.2349 5.99268 10.4635 6.06802 10.6522 6.20761L19.5563 12.7781C19.7422 12.915 19.8801 13.1071 19.9503 13.327C20.0204 13.5469 20.0193 13.7833 19.9469 14.0025C19.8746 14.2216 19.7349 14.4124 19.5476 14.5475C19.3604 14.6826 19.1352 14.7551 18.9043 14.7547Z"
                                                fill="#FF3D00" />
                                            <path
                                                d="M18.9043 9.00568C18.6696 9.00609 18.4411 8.93124 18.2522 8.79214L10.0002 2.70898L1.7481 8.79214C1.51412 8.96495 1.22104 9.0378 0.93331 8.99468C0.645583 8.95155 0.386785 8.79597 0.213849 8.56218C0.0409137 8.32838 -0.0319941 8.03551 0.011165 7.74799C0.054324 7.46048 0.210015 7.20187 0.443986 7.02906L9.3481 0.458588C9.5368 0.318997 9.76537 0.243652 10.0002 0.243652C10.2349 0.243652 10.4635 0.318997 10.6522 0.458588L19.5563 7.02906C19.7422 7.16598 19.8801 7.35809 19.9503 7.57797C20.0204 7.79785 20.0193 8.03426 19.947 8.25344C19.8746 8.47262 19.7349 8.66338 19.5476 8.79847C19.3604 8.93356 19.1352 9.00608 18.9043 9.00568Z"
                                                fill="#FF3D00" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_39163_1044">
                                                <rect width="20" height="14.5098" fill="white"
                                                    transform="translate(0 0.245117)" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </button>
                                <button class="prio-btn" id="medium" type="button" onclick="setprio('medium')">
                                    Medium <svg width="20" height="9" viewBox="0 0 20 9" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <g clip-path="url(#clip0_39163_1051)">
                                            <path
                                                d="M18.9041 8.22528H1.09589C0.805242 8.22528 0.526498 8.10898 0.320979 7.90197C0.11546 7.69495 0 7.41419 0 7.12143C0 6.82867 0.11546 6.5479 0.320979 6.34089C0.526498 6.13388 0.805242 6.01758 1.09589 6.01758H18.9041C19.1948 6.01758 19.4735 6.13388 19.679 6.34089C19.8845 6.5479 20 6.82867 20 7.12143C20 7.41419 19.8845 7.69495 19.679 7.90197C19.4735 8.10898 19.1948 8.22528 18.9041 8.22528Z"
                                                fill="#FFA800" />
                                            <path
                                                d="M18.9041 2.98211H1.09589C0.805242 2.98211 0.526498 2.86581 0.320979 2.6588C0.11546 2.45179 0 2.17102 0 1.87826C0 1.5855 0.11546 1.30474 0.320979 1.09772C0.526498 0.890712 0.805242 0.774414 1.09589 0.774414L18.9041 0.774414C19.1948 0.774414 19.4735 0.890712 19.679 1.09772C19.8845 1.30474 20 1.5855 20 1.87826C20 2.17102 19.8845 2.45179 19.679 2.6588C19.4735 2.86581 19.1948 2.98211 18.9041 2.98211Z"
                                                fill="#FFA800" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_39163_1051">
                                                <rect width="20" height="7.45098" fill="white"
                                                    transform="translate(0 0.774414)" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </button>
                                <button class="prio-btn" id="low" type="button" onclick="setprio('low')">
                                    Low <svg width="20" height="15" viewBox="0 0 20 15" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M10 9.00614C9.7654 9.00654 9.53687 8.9317 9.34802 8.79262L0.444913 2.22288C0.329075 2.13733 0.231235 2.02981 0.15698 1.90647C0.0827245 1.78313 0.033508 1.64638 0.0121402 1.50404C-0.031014 1.21655 0.0418855 0.923717 0.214802 0.689945C0.387718 0.456173 0.646486 0.300615 0.934181 0.257493C1.22188 0.21437 1.51493 0.287216 1.74888 0.460004L10 6.54248L18.2511 0.460004C18.367 0.374448 18.4985 0.312529 18.6383 0.277782C18.7781 0.243035 18.9234 0.236141 19.0658 0.257493C19.2083 0.278844 19.3451 0.328025 19.4685 0.402225C19.592 0.476425 19.6996 0.574193 19.7852 0.689945C19.8708 0.805697 19.9328 0.937168 19.9676 1.07685C20.0023 1.21653 20.0092 1.36169 19.9879 1.50404C19.9665 1.64638 19.9173 1.78313 19.843 1.90647C19.7688 2.02981 19.6709 2.13733 19.5551 2.22288L10.652 8.79262C10.4631 8.9317 10.2346 9.00654 10 9.00614Z"
                                            fill="#7AE229" />
                                        <path
                                            d="M10 14.7547C9.7654 14.7551 9.53687 14.6802 9.34802 14.5412L0.444913 7.97142C0.210967 7.79863 0.0552944 7.54005 0.0121402 7.25257C-0.031014 6.96509 0.0418855 6.67225 0.214802 6.43848C0.387718 6.20471 0.646486 6.04915 0.934181 6.00603C1.22188 5.96291 1.51493 6.03575 1.74888 6.20854L10 12.291L18.2511 6.20854C18.4851 6.03575 18.7781 5.96291 19.0658 6.00603C19.3535 6.04915 19.6123 6.20471 19.7852 6.43848C19.9581 6.67225 20.031 6.96509 19.9879 7.25257C19.9447 7.54005 19.789 7.79863 19.5551 7.97142L10.652 14.5412C10.4631 14.6802 10.2346 14.7551 10 14.7547Z"
                                            fill="#7AE229" />
                                    </svg>
                                </button>
                            </div>
                            <span>Subtasks</span>
                            <div class="subtasks" style="background-color:white">
                                <input id="subtask" placeholder="Add new subtask" minlength="2" type="text"
                                    onkeydown="return event.key != 'Enter';">
                                <svg onclick="addSubtask()" width="18" height="18" viewBox="0 0 18 18" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M9.00113 9.00017L9.00178 16.4149M1.58641 9.00082L9.00113 9.00017L1.58641 9.00082ZM16.4159 8.99953L9.00043 8.99946L16.4159 8.99953ZM9.00043 8.99946L9.00049 1.58545L9.00043 8.99946Z"
                                        stroke="black" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" />
                                </svg>
                            </div>
                            <ul id="subtasks">
                            </ul>

                        </div>
                    </div>

                    <div class="flex btns">
                        <button class="btn-bg-white" type="button" onclick="clearForm()">
                            Clear
                            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M6.50106 6.50008L11.7441 11.7431M1.25806 11.7431L6.50106 6.50008L1.25806 11.7431ZM11.7441 1.25708L6.50006 6.50008L11.7441 1.25708ZM6.50006 6.50008L1.25806 1.25708L6.50006 6.50008Z"
                                    stroke="#2A3647" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </button>
                        <button id="createBtn" class="btn-bg-blue">
                            Create Task
                            <svg width="18" height="15" viewBox="0 0 18 15" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 7.5L7 13.5L17 1.5" stroke="white" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" />
                            </svg>

                        </button>
                    </div>

                    <div id="taskAdded" class="flex d-none">
                        <div>
                            Task added to Bord
                            <svg width="27" height="22" viewBox="0 0 27 22" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M20.5 1.99979L20.5 19.9998C20.4995 20.5301 20.2886 21.0385 19.9136 21.4134C19.5387 21.7884 19.0303 21.9993 18.5 21.9998L14.5 21.9998C13.9697 21.9993 13.4613 21.7884 13.0864 21.4134C12.7114 21.0385 12.5005 20.5301 12.5 19.9998L12.5 1.99979C12.5005 1.46952 12.7114 0.961118 13.0864 0.58616C13.4613 0.211202 13.9697 0.000317938 14.5 -0.000212328L18.5 -0.000212503C19.0303 0.000317717 19.5387 0.211202 19.9136 0.58616C20.2886 0.961118 20.4995 1.46952 20.5 1.99979ZM14.5 19.9998L18.5 19.9998L18.5 1.99979L14.5 1.99979L14.5 19.9998ZM14.5 1.99979L14.5 19.9998C14.4995 20.5301 14.2886 21.0384 13.9136 21.4134C13.5387 21.7883 13.0303 21.9992 12.5 21.9998L8.5 21.9998C7.96973 21.9992 7.46133 21.7883 7.08637 21.4134C6.71141 21.0384 6.50053 20.53 6.5 19.9998L6.5 1.99977C6.50053 1.4695 6.71141 0.961097 7.08637 0.586139C7.46133 0.211181 7.96973 0.000299127 8.5 -0.000231139L12.5 -0.000231314C13.0303 0.000298906 13.5387 0.211181 13.9136 0.586139C14.2886 0.961097 14.4995 1.46952 14.5 1.99979ZM8.5 19.9998L12.5 19.9998L12.5 1.99979L8.5 1.99977L8.5 19.9998ZM8.5 1.99977L8.5 19.9998C8.49947 20.53 8.28859 21.0384 7.91363 21.4134C7.53867 21.7883 7.03027 21.9992 6.5 21.9998L2.5 21.9998C1.96973 21.9992 1.46133 21.7883 1.08637 21.4134C0.711413 21.0384 0.500529 20.53 0.5 19.9998L0.499999 1.99977C0.500529 1.4695 0.711412 0.961098 1.08637 0.58614C1.46133 0.211182 1.96973 0.000299389 2.5 -0.000230877L6.5 -0.000231051C7.03027 0.000299168 7.53867 0.211181 7.91363 0.586139C8.28859 0.961097 8.49947 1.4695 8.5 1.99977ZM2.5 19.9998L6.5 19.9998L6.5 1.99977L2.5 1.99977L2.5 19.9998Z"
                                    fill="white" />
                                <path
                                    d="M26.5 2.00001L26.5 20C26.4995 20.5303 26.2886 21.0387 25.9136 21.4136C25.5387 21.7886 25.0303 21.9995 24.5 22L20.5 22C19.9697 21.9995 19.4613 21.7886 19.0864 21.4136C18.7114 21.0387 18.5005 20.5301 18.5 19.9998L18.5 1.99979C18.5005 1.46952 18.7114 0.961339 19.0864 0.586381C19.4613 0.211423 19.9697 0.000540836 20.5 1.05699e-05L24.5 1.0395e-05C25.0303 0.000540615 25.5387 0.211423 25.9136 0.586381C26.2886 0.961339 26.4995 1.46974 26.5 2.00001ZM20.5 19.9998L24.5 20L24.5 2.00001L20.5 1.99979L20.5 19.9998Z"
                                    fill="white" />
                            </svg>
                        </div>


                    </div>



                </form>
            </div>

        </div>
</div>
    `
}