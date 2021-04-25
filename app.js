var PORT = process.env.PORT || 3000;
var express=require("express");
var methodOverride=require("method-override");
var expressSanitizer=require("express-sanitizer");
var app=express();
var bodyParser=require("body-Parser");
var mongoose=require("mongoose");


//APP CONFIG
//mongoose.connect("mongodb://localhost/restful_blog_app");
mongoose.connect("mongodb+srv://priyanshu:Shreyansh@123@blog.3qcbh.mongodb.net/restful_blog_app?retryWrites=true&w=majority",{useUnifiedTopology: true,
  useNewUrlParser: true});
//mongodb+srv://priyanshu:Shreyansh@123@blog.3qcbh.mongodb.net/restful_blog_app?retryWrites=true&w=majority
//mongoose.connect("mongodb+srv://priyanshu:Shreyansh@123@blogapp.3qcbh.mongodb.net/restful_blog_app?retryWrites=true&w=majority",{useUnifiedTopology: true,
  //useNewUrlParser: true});
//mongoose.connect("mongodb+srv://priyanshu:<Shreyansh@123>@blogapp.3qcbh.mongodb.net/blogapp");
//mongodb+srv://priyanshu:Shreyansh@123@blogapp.3qcbh.mongodb.net/restful_blog_app?retryWrites=true&w=majority
//mongodb+srv://priyanshu:<Shreyansh@123>@blogapp.3qcbh.mongodb.net/test?retryWrites=true&w=majority
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

//MONGOOSE/MODEL CONFIG 
var blogSchema=new mongoose.Schema({
	title:String,
	image:String,
	body:String,
	created:{type:Date,default:Date.now}  
});

var Blog=mongoose.model("Blog",blogSchema);

// Blog.create(
// {
// 	title:"Test Blog",
// 	image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZItzAWtOGS6UP7Bj8ufY1pVJor6-lduOEwA&usqp=CAU",
// 	body:"Hello this is a blogpost"
// });

//RESTFUL ROUTES


app.get("/",function(req,res){
	res.redirect("blogs");
});


//INDEX ROUTE
app.get("/blogs", function(req,res) {
	Blog.find({},function(err, blogs){
		if(err)
			console.log("ERROR!");
		else
			res.render("bhag",{blogs: blogs});
	});
});

//NEW ROUTE
app.get("/blogs/new",function(req,res){
	res.render("new1");
});

//CREATE ROUTE
app.post("/blogs/new",function(req,res){
	//create blog
	//create()is database function
	req.body.blog.body=req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog,function(err,newBlog){
		if(err)
			res.render("new1");
		else
			res.redirect("/blogs");
	});

});

//SHOW ROUTE
app.get("/blogs/:id",function(req,res){

	Blog.findById(req.params.id,function(err, foundBlog){
		if(err)
			res.redirect("/blogs");
		else
			res.render("show1",{blog: foundBlog});
	});
	
});

//EDIT ROUTE
app.get("/blogs/:id/edit",function(req,res){

	Blog.findById(req.params.id,function(err, foundBlog){
		if(err)
			res.redirect("/blogs");
		else
			res.render("edit1",{blog: foundBlog});
	});
	
});
 
//UPDATE ROUTE
app.put("/blogs/:id",function(req,res){
	req.body.blog.body=req.sanitize(req.body.blog.body);
Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err,updatedBlog){
	if(err)
		res.redirect("/blogs");
	else
		res.redirect("/blogs");
		//res.redirect(303, "/blogs/" + req.params.id);
	});
	
});

//DELETE ROUTE
app.delete("/blogs/:id",function(req,res){
	//destroy blog
	Blog.findByIdAndRemove(req.params.id,function(err){
		if(err)
			res.redirect("/blogs");
		else
			res.redirect("/blogs");	
	});
	//redirect somewhere	
});

app.listen(3000,function (){
	console.log("SERVER IS RUNNING");
	// body...
}); 