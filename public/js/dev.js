$(document).ready(function () {
    // This file just does a GET request to figure out which user is logged in
    // and updates the HTML on the page
    $.get('/api/user_data').then(function (data) {
        //this is where we could handle routing based upon auth_level
        $('.member-name').text(data.username);
        $('.member-id').text(data.id);
        $('.member-auth_level').text(`developer`);
        // window.location.replace(`/${data.auth_level}`);
        renderProjectBtns(data.id);
    });

    $('.auth_selector').change(function () {
        var val = this.value;
        $.get('/api/user_data').then(function (data) {
            $.post(`/api/auth_level/${data.id}/${val}`);
            $('.member-auth_level').text(val);
            window.location.replace(`/${val}`);
        });
    });

    // When a project button is clicked
    $('.user-projects').on(
        'click',
        'button.project-btn',
        handleProjectBtnClick
    );

    // Displays all projects as buttons
    function renderProjectBtns(userId) {
        $.get(`/api/projects/${userId}`).then(function (data) {
            // Loops through GET data and appends each project
            data.forEach(function (project) {
                $('.user-projects').append(`
                <button class="project-btn" id="${project.id}">${project.title}</button)
                `);
            });
        });
    }

    // Handles Project Button click
    function handleProjectBtnClick(event) {
        event.preventDefault();
        $('.tasks-deck').empty();

        let userId = $('.member-id').text();
        // 'This' represents the project button that was clicked
        let projectId = $(this).attr('id');

        // GETS all phases associated with the selected project
        // I start here because my objective is to obtain all of the users tasks for a particular project. I need to know what phase id the task belongs to.
        $.get(`/api/project-phase/project_id=${projectId}`).then(function (
            phaseData
        ) {
            // Render projects with user id and all phase data
            renderProjectTasks(userId, phaseData);
        });
    }

    function renderProjectTasks(userId, phaseData) {
        // Loops through Phase data and gets every task assigned to the user for a specific phase -- Appends only tasks associated with the specific project
        phaseData.forEach(function (phase) {
            $.get(`/api/tasks/user_id=${userId}/phase_id=${phase.id}`).then(
                function (data) {
                    appendTasks(data);
                }
            );
        });
    }

    function appendTasks(taskData) {
        taskData.forEach(function (task) {
            // Appends all Tasks that have not been completed
            if (!task.isComplete) {
                $('.tasks-deck').append(`
                    <div class="card task-card" style="width: 18rem;">
                      <div class="card-body">
                        <h3>${task.taskname}</h3>
                        <ul>
                            <li>
                                <h5>Phase Id: ${task.ProjectPhaseId}</h5>
                            <li>
                                <h5>Status:</h5>
                                <div class="status-dropdown">
                                    <select 
                                      class="status_selector"
                                      name="isComplete"
                                      id="${task.id}"
                                    >
                                    <option
                                    value="false">In progress</option>
                                    <option
                                    value="true">Complete</option>
                                </div>
                            </li>
                        </ul>
                      </div>
                    </div>
        `);
            }
        });

        // Allows the Dev to change the status of their task and will update the DB when a change is made
        $('.status_selector').change(function () {
            $.ajax({
                type: 'PUT',
                url: '/api/tasks',
                data: { id: this.id, isComplete: this.value }
            })
                .done(function () {
                    console.log('successfully updated task');
                })
                .fail(function (err) {
                    if (err) throw err;
                });
        });
    }
});