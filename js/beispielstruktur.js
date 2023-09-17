
let users = [
    {
        'user_1': [
            {
                'user_data': [
                    {
                        'login_name': 'Wilhelm Teicke',
                        'login_password': 'xxxxxxx'
                    }
                ],
                'tasks': [
                    {
                        'task_status': 'To do',
                        'title': 'Website redesign',
                        'description': 'Modify the contents of the main website...',
                        'category': 'Design',
                        'contactSelection': ['WT', 'KR', 'CB', 'PE'],
                        'date': 'xxx',
                        'prio': 'Low',
                        'subtasks': 'xxx'
                    },
                    {
                        'task_status': 'Awaiting Feedback',
                        'title': 'Video Cut',
                        'description': 'Edit the new company video',
                        'category': 'Media',
                        'contactSelection': ['KR', 'PE', 'KR', 'KR', 'KR', 'KR'],
                        'date': 'xxx',
                        'prio': 'Low',
                        'subtasks': 'xxx'
                    },
                ],
                'subtasks': [

                ],
                'contacts': [
                    {
                        'contact_name': '...',
                        'contact_email': '...',
                    }
                ],
                'categorys': [
                    {
                        'name': 'New Category',
                        'color': 'blue'
                    },
                    {
                        'name': 'Software Development',
                        'color': 'blue'
                    },
                    {
                        'name': 'UX/UI Design',
                        'color': 'blue'
                    },
                    {
                        'name': 'Marketing',
                        'color': 'blue'
                    },
                    {
                        'name': 'Sales',
                        'color': 'blue'
                    }
                ]
            }
        ]
    },
    {
        'user_2': [
            {
                'user_data': [
                    {
                        'login_name': 'Wilhelm Teicke',
                        'login_password': 'xxxxxxx'
                    }
                ],
                'tasks': [
                    {
                        'task_status': 'To do',
                        'title': 'Website redesign',
                        'description': 'Modify the contents of the main website...',
                        'category': 'Design',
                        'contactSelection': ['WT', 'KR', 'CB', 'PE'],
                        'date': 'xxx',
                        'prio': 'Low',
                        'subtasks': 'xxx'
                    },
                    {
                        'task_status': 'Awaiting Feedback',
                        'title': 'Video Cut',
                        'description': 'Edit the new company video',
                        'category': 'Media',
                        'contactSelection': ['KR', 'PE', 'KR', 'KR', 'KR', 'KR'],
                        'date': 'xxx',
                        'prio': 'Low',
                        'subtasks': 'xxx'
                    },
                ],
                'subtasks': [

                ],
                'contacts': [
                    {
                        'contact_name': '...',
                        'contact_email': '...',
                    }
                ],
                'categorys': [
                    {
                        'name': 'New Category',
                        'color': 'blue'
                    },
                    {
                        'name': 'Software Development',
                        'color': 'blue'
                    },
                    {
                        'name': 'UX/UI Design',
                        'color': 'blue'
                    },
                    {
                        'name': 'Marketing',
                        'color': 'blue'
                    },
                    {
                        'name': 'Sales',
                        'color': 'blue'
                    }
                ]
            }
        ]
    }
]

function safeInStorage() {
    localStorage.setItem('users', JSON.stringify(users));
}