using GradesApi;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Grades API",
        Version = "v1",
        Description = "API de gestion des notes étudiantes"
    });

    var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    options.IncludeXmlComments(xmlPath);
});

builder.Services.AddSingleton<IGradeRepository, InMemoryGradeRepository>();
builder.Services.AddScoped<GradeService>();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "Grades API v1");
    options.RoutePrefix = string.Empty;
});

app.MapControllers();
app.Run();

// Rend la classe Program accessible depuis le projet de tests
public partial class Program;
