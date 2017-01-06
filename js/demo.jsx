//http://www.cnblogs.com/jarson-7426/p/5524976.html
var TodoBox = React.createClass({
  getInitialState: function() {
    return {
      data: [
      ]
    };
  },


  componentDidMount: function() {
    this.selectList();
  },

  selectList: function() {
    this.serverRequest = $.get(this.props.url, function (data) {
      this.setState({data: data});
    }.bind(this));
  },

  // 根据id删除一项任务
  handleTaskDelete: function(taskId) {
    console.log(taskId);
    var str = "taskId=" +taskId;
    $.ajax({
      url: this.props.urlDel,
      dataType: 'String',
      type: 'get',
      data: str,
      success: function (data) {
        this.setState({data: data});
      }.bind(this),
      error: function (xhr, status, err) {
      }.bind(this)
    });
    this.selectList();
  },

  // 切换一项任务的完成状态
  handleToggleComplete: function(taksId) {
    var data = this.state.data;
    for(var i in data) {
      if (data[i].id === taksId) {
        data[i].complete = data[i].complete === "true" ? "false" : "true";
        break;
      }
    }
    this.setState({data});
  },

  // 给新增的任务一个随机的id
  generateId: function() {
    return Math.floor(Math.random() * 9000) + 1000;
  },

  // 新增一项任务
  handleSubmit: function(task) {
    var id = this.generateId();
    var complete = "false";
    var str = "?id=" +id+"&task="+task+"&complete=false";
    $.ajax({
      url: this.props.url1,
      dataType: 'String',
      type: 'POST',
      data: str,
      success: function (data) {
        alert(data);
        this.setState({data: data});
      }.bind(this),
      error: function (xhr, status, err) {
      }.bind(this)
    });
    this.selectList();
  },

  render: function() {
    var statistics = {
      // 统计任务总数及完成的数量
      todoCount: this.state.data.length || 0,
      todoCompleteCount: this.state.data.filter(function(item) {
        return item.complete === "true";
      }).length
    };

    return (
      <div className="well">
        <h1 className="text-center">React Todo</h1>
        <TodoList data={this.state.data}
          deleteTask={this.handleTaskDelete}
          toggleComplete={this.handleToggleComplete}
          todoCount={statistics.todoCount}
          todoCompleteCount={statistics.todoCompleteCount} />
        <TodoForm submitTask={this.handleSubmit} />
      </div>
    )
  }
});


var TodoList = React.createClass({
  render: function() {
    var taskList = this.props.data.map(function(listItem) {
      return (
        <TodoItem
          taskId={listItem.id}
          key={listItem.id}
          task={listItem.task}
          complete={listItem.complete}
          deleteTask={this.props.deleteTask}
          toggleComplete={this.props.toggleComplete} />
      )
    }, this);

    return (
        <ul className="list-group">
          {taskList}
          <TodoFooter todoCount={this.props.todoCount} todoCompleteCount={this.props.todoCompleteCount} />
        </ul>
    );
  }
});

var TodoItem = React.createClass({
  toggleComplete: function() {
    this.props.toggleComplete(this.props.taskId);
  },

  deleteTask: function() {
    this.props.deleteTask(this.props.taskId);
  },

  // 鼠标移入显示删除按钮
  handleMouseOver: function() {
    ReactDOM.findDOMNode(this.refs.deleteBtn).style.display = "inline";
  },

  handleMouseOut: function() {
    ReactDOM.findDOMNode(this.refs.deleteBtn).style.display = "none";
  },

  render: function() {
    var task = this.props.task;
    var classes = "list-group-item"
    var itemChecked;
    if (this.props.complete === "true") {
      task = <s>{task}</s>
      itemChecked = true;
      classes += " list-group-item-success"
    } else {
      itemChecked = false;
    }

    return (
      <li className={classes}
        onMouseOver={this.handleMouseOver}
        onMouseOut={this.handleMouseOut}>
        <input type="checkbox" checked={itemChecked} onChange={this.toggleComplete} className="pull-left" />
        {task}
        <div className="pull-right">
          <button type="button" className="btn btn-xs close" onClick={this.deleteTask} ref="deleteBtn">删除</button>
        </div>
      </li>
    );
  }
});

var TodoFooter = React.createClass({
  render: function() {
    return (
      <li className="list-group-item">{this.props.todoCompleteCount}已完成 / {this.props.todoCount}总数</li>
    )
  }
});

var TodoForm = React.createClass({
  submitTask: function(e) {
    e.preventDefault();
    var task = ReactDOM.findDOMNode(this.refs.task).value.trim();
    if (!task) {
      return;
    }
    this.props.submitTask(task);
    ReactDOM.findDOMNode(this.refs.task).value = "";
  },

  render: function() {
    return (
      <div>
        <hr />
        <form className="form-horizontal" onSubmit={this.submitTask}>
          <div className="form-group">
            <label for="task" className="col-md-2 control-label">Task</label>
            <div className="col-md-10">
              <input type="text" id="task" ref="task" className="form-control" placeholder="你想做点什么"></input>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 text-right">
              <input type="submit" value="Save Task" className="btn btn-primary" />
            </div>
          </div>
        </form>
      </div>
    )
  }
});

ReactDOM.render(
	<TodoBox url="http://localhost:8089/list" url1="http://localhost:8089/add" urlDel="http://localhost:8089/del"/>,
	document.getElementById('todoBox')
);
